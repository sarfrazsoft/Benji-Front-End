import { ChangeDetectorRef, Directive, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import * as LogRocket from 'logrocket';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, ContextService } from 'src/app/services';
import { BackendRestService } from 'src/app/services/backend/backend-rest.service';
import { BackendSocketService } from 'src/app/services/backend/backend-socket.service';
import {
  ActivityEvent,
  ServerMessage,
  TeamUser,
  Timer,
  UpdateMessage,
  User,
} from 'src/app/services/backend/schema';
import { Course, Lesson, LessonRun, Participant } from 'src/app/services/backend/schema/course_details';
import { UtilsService } from 'src/app/services/utils.service';

@Directive()
export class BaseLessonComponent implements OnInit, OnDestroy, OnChanges {
  roomCode: number;
  lessonRun: LessonRun;
  user: User;
  clientType: 'screen' | 'participant';
  disableControls: boolean;
  participantDetails: Participant;

  socket;
  serverMessage: UpdateMessage;
  serverOffsets: number[];
  avgServerTimeOffset: number;
  facilitatorConnected = false;
  timer;

  constructor(
    protected deviceDetectorService: DeviceDetectorService,
    protected utilsService: UtilsService,
    protected restService: BackendRestService,
    protected route: ActivatedRoute,
    protected socketService: BackendSocketService,
    clientType: 'screen' | 'participant',
    protected contextService: ContextService,
    protected authService: AuthService,
    protected permissionsService: NgxPermissionsService,
    protected ref?: ChangeDetectorRef,
    protected _snackBar?: MatSnackBar
  ) {
    this.roomCode = parseInt(this.route.snapshot.paramMap.get('roomCode'), 10);
    this.clientType = clientType;
    this.avgServerTimeOffset = 0;
    this.serverOffsets = [];
    this.authService.closeIntercom();
  }

  ngOnInit() {
    if (localStorage.getItem('participant_' + this.roomCode)) {
      this.permissionsService.loadPermissions(['PARTICIPANT']);
      this.clientType = 'participant';
    } else if (localStorage.getItem('host_' + this.roomCode)) {
      this.permissionsService.loadPermissions(['ADMIN']);
    } else if (localStorage.getItem('participant')) {
      const participant: Participant = JSON.parse(localStorage.getItem('participant'));
      if (participant.lessonrun_code === this.roomCode) {
        // participant was created for this lesson
        this.permissionsService.loadPermissions(['PARTICIPANT']);
        this.clientType = 'participant';
      } else {
        // this participant has been part of some other lesson
        this.authService.navigateToLessonLobby(this.roomCode);
      }
    } else if (this.authService.isLoggedIn()) {
      if (localStorage.getItem('user')) {
        const user: TeamUser = JSON.parse(localStorage.getItem('user'));
        this.authService.joinSessionAsLoggedInUser(user, this.roomCode);
      }
    } else if (!this.authService.isLoggedIn()) {
      // navigate to lesson lobby
      this.authService.redirectURL = window.location.href;
      this.authService.navigateToLessonLobby(this.roomCode);
    }
    this.initSocket();

    // document.addEventListener('visibilitychange', () => {
    //   const resetConnection = localStorage.getItem('resetConnection');
    //   if (resetConnection === 'false') {
    //     // don't reset connection participant is
    //     // about to pick up brainstorm image
    //   } else {
    //     // if (this.deviceDetectorService.isMobile()) {
    //     if (document.hidden) {
    //       // stop running expensive task
    //       this.socket = undefined;
    //     } else {
    //       // page has focus, begin running task
    //       if (!this.isConnected()) {
    //         setTimeout(() => {
    //           this.initSocket();
    //         }, 500);
    //       }
    //     }
    //     // }
    //   }
    // });

    this.route.queryParams.subscribe((params) => {
      if (params['share'] === 'participant') {
        // disable controls
        this.disableControls = true;
      } else if (params['share'] === 'facilitator') {
        // take to login screen
        this.authService.loginUser();
        this.disableControls = false;
      }
    });
  }

  ngOnChanges() {
    // this.timer = this.getTimerTool();
    // console.log(this.timer);
  }

  ngOnDestroy() {}

  initSocket() {
    if (localStorage.getItem('participant_' + this.roomCode)) {
      this.participantDetails = JSON.parse(localStorage.getItem('participant_' + this.roomCode));
    }

    this.restService.get_lessonrun(this.roomCode).subscribe((lessonRun) => {
      this.lessonRun = lessonRun;
      this.contextService.brandingInfo = lessonRun.branding;
      if (lessonRun.lesson.single_user_lesson) {
        if (localStorage.getItem('single_user_participant')) {
          // single user participant info is already stored
          // single user info is removed when user navigates back to dashboard
          this.participantDetails = JSON.parse(localStorage.getItem('single_user_participant'));
          this.connectAndSubscribe();
        } else {
          // create a single user and store it in local storage so that we don't
          // sign in again and again
          this.authService
            .createParticipant(lessonRun.host.first_name, lessonRun.lessonrun_code)
            .subscribe((participant: Participant) => {
              if (participant) {
                this.participantDetails = participant;
                // store the participant info one time it is aquired
                localStorage.setItem('single_user_participant', JSON.stringify(participant));
                this.connectAndSubscribe();
              }
            });
        }
      } else {
        this.connectAndSubscribe();
      }
    });
  }

  connectAndSubscribe() {
    this.socket = this.socketService.connectLessonSocket(
      this.clientType,
      this.lessonRun,
      this.participantDetails ? this.participantDetails.participant_code : null
    );
    this.socket.subscribe(
      (serverMessage: ServerMessage) => {
        this.handleServerMessage(serverMessage);
      },
      (err) => {
        console.log('Error subscribing to to socket');
        console.log(err);
        LogRocket.error('Error subscribing to to socket', err);
        this.connectAndSubscribe();
      },
      () => {
        console.log('complete');
      }
    );
  }

  isConnected() {
    return this.socket !== undefined;
  }

  isFacilitatorConnected() {
    return this.facilitatorConnected;
  }

  handleServerMessage(msg: ServerMessage) {
    if (msg.updatemessage !== null && msg.updatemessage !== undefined) {
      if (this.serverMessage) {
        const sMActivity_type = this.serverMessage.activity_type.toLowerCase();
        const uMActivity_type = msg.updatemessage.activity_type.toLowerCase();
        if (
          this.serverMessage[sMActivity_type].activity_id !== msg.updatemessage[uMActivity_type].activity_id
        ) {
          this.serverMessage = null;
          this.ref.detectChanges();
        }
      }
      this.facilitatorConnected = true;

      // this.serverMessage = msg.updatemessage;
      // this.serverMessage.eventType = msg.eventtype;

      this.serverMessage = {
        ...msg.updatemessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === 'NotificationEvent') {
      console.log(msg);
      this.serverMessage = {
        ...this.serverMessage,
        notifications: msg.notifications,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
      console.log(this.serverMessage);
    } else if (msg.clienterror !== null && msg.clienterror !== undefined) {
      // console.log(msg);
      const obj = msg.clienterror.error_detail;
      if (typeof obj === 'string') {
      } else {
        if (obj[Object.keys(obj)[0]]) {
          if (obj[Object.keys(obj)[0]][0]) {
            this.utilsService.openWarningNotification(obj[Object.keys(obj)[0]][0], '');
          }
        }
      }
    } else if (msg.servererror !== null && msg.servererror !== undefined) {
      console.log(msg);
    } else if (msg.servernotification !== null && msg.servernotification !== undefined) {
      if (msg.servernotification) {
        const notify_type = msg.servernotification.notification_type;
        if (notify_type === 'no_facilitator') {
          console.log('facilitator not connected');
          this.facilitatorConnected = false;
        }
      }
    }
    if (msg.messagetime !== null && msg.updatemessage !== undefined) {
      this.serverOffsets.push(msg.messagetime - Date.now());
      if (this.serverOffsets.length > 10) {
        this.serverOffsets.shift();
      }
      this.avgServerTimeOffset =
        this.serverOffsets.reduce(function (a, b) {
          return a + b;
        }) / this.serverOffsets.length;
    }
  }

  getActivityType() {
    if (this.serverMessage.activity_type !== null) {
      return this.serverMessage.activity_type;
    } else {
      return null;
    }
  }

  isLastActivity() {
    if (this.serverMessage) {
      const activity_type = this.serverMessage.activity_type.toLowerCase();
      return !this.serverMessage[activity_type].next_activity;
    }
  }

  public sendSocketMessage(evt: ActivityEvent) {
    this.socket.next(evt.toMessage());
  }

  getEventType() {
    // console.log(this.serverMessage);
  }

  public getParticipantCode(): number {
    let details: Participant;
    const lessonRunCode = this.serverMessage.lesson_run.lessonrun_code;
    if (localStorage.getItem('participant_' + lessonRunCode)) {
      details = JSON.parse(localStorage.getItem('participant_' + lessonRunCode));
      return details.participant_code;
    }
  }
}

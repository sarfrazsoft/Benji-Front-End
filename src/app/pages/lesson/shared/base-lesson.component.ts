import { ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService, ContextService } from 'src/app/services';
import { BackendRestService } from 'src/app/services/backend/backend-rest.service';
import { BackendSocketService } from 'src/app/services/backend/backend-socket.service';
import { ActivityEvent, ServerMessage, UpdateMessage, User } from 'src/app/services/backend/schema';
import { Course, Lesson, LessonRun, Participant } from 'src/app/services/backend/schema/course_details';

export class BaseLessonComponent implements OnInit {
  roomCode: number;
  lessonRun: LessonRun;
  user: User;
  clientType: string;
  disableControls: boolean;

  socket;
  serverMessage: UpdateMessage;
  serverOffsets: number[];
  avgServerTimeOffset: number;
  facilitatorConnected = false;

  constructor(
    protected restService: BackendRestService,
    protected route: ActivatedRoute,
    protected socketService: BackendSocketService,
    clientType: string,
    protected contextService: ContextService,
    protected authService: AuthService,
    protected ref?: ChangeDetectorRef,
    protected _snackBar?: MatSnackBar
  ) {
    this.roomCode = parseInt(this.route.snapshot.paramMap.get('roomCode'), 10);
    this.clientType = clientType;
    this.avgServerTimeOffset = 0;
    this.serverOffsets = [];
  }

  ngOnInit() {
    this.initSocket();

    document.addEventListener('visibilitychange', () => {
      const resetConnection = localStorage.getItem('resetConnection');
      if (resetConnection === 'false') {
        // don't reset connection participant is
        // about to pick up brainstorm image
      } else {
        if (document.hidden) {
          // stop running expensive task
          this.socket = undefined;
        } else {
          // page has focus, begin running task
          if (!this.isConnected()) {
            setTimeout(() => {
              this.initSocket();
            }, 500);
          }
        }
      }
    });

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

  initSocket() {
    let details: Participant;
    if (localStorage.getItem('participant')) {
      details = JSON.parse(localStorage.getItem('participant'));
    }
    forkJoin([this.restService.get_lessonrun(this.roomCode)]).subscribe(([lessonRun]) => {
      this.lessonRun = lessonRun;
      this.socket = this.socketService.connectLessonSocket(
        this.clientType,
        this.lessonRun.lessonrun_code,
        details ? details.participant_code : null
      );
      console.log('socket connected');

      this.socket.subscribe(
        (msg: ServerMessage) => {
          this.handleServerMessage(msg);
        },
        (err) => console.log(err),
        () => {
          console.log('complete');
        }
      );
    });
  }

  isConnected() {
    return this.socket !== undefined;
  }

  isFacilitatorConnected() {
    return this.facilitatorConnected;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['bg-warning-color', 'white-color', 'simple-snack-bar'],
    });
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
      this.serverMessage = msg.updatemessage;
    } else if (msg.clienterror !== null && msg.clienterror !== undefined) {
      console.log(msg);
      const obj = msg.clienterror.error_detail;
      if (obj[Object.keys(obj)[0]]) {
        if (obj[Object.keys(obj)[0]][0]) {
          this.openSnackBar(obj[Object.keys(obj)[0]][0], '');
        }
      }
    } else if (msg.servererror !== null && msg.servererror !== undefined) {
      console.log(msg);
    } else if (msg.servernotification !== null && msg.servernotification !== undefined) {
      console.log(msg);
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

  public sendSocketMessage(evt: ActivityEvent) {
    this.socket.next(evt.toMessage());
  }
}

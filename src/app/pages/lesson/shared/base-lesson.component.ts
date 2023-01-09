import { ChangeDetectorRef, Directive, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import * as LogRocket from 'logrocket';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, ContextService } from 'src/app/services';
import { BackendRestService } from 'src/app/services/backend/backend-rest.service';
import { BackendSocketService } from 'src/app/services/backend/backend-socket.service';
import {
  ActivityEvent,
  Board,
  BrainstormCreateCategoryEvent,
  EventTypes,
  ServerMessage,
  TeamUser,
  Timer,
  UpdateMessage,
  User,
} from 'src/app/services/backend/schema';
import { Course, Lesson, LessonRun, Participant } from 'src/app/services/backend/schema/course_details';
import {
  BrainstormAddBoardResponse,
  BrainstormAddRemoveIdeaPinResponse,
  BrainstormBoardBackgroundResponse,
  BrainstormBoardPostSizeResponse,
  BrainstormBoardSortOrderResponse,
  BrainstormChangeBoardStatusResponse,
  BrainstormChangeModeResponse,
  BrainstormCreateCategoryResponse,
  BrainstormEditResponse,
  BrainstormRemoveBoardResponse,
  BrainstormRemoveCategoryResponse,
  BrainstormRemoveIdeaCommentResponse,
  BrainstormRemoveIdeaHeartResponse,
  BrainstormRemoveSubmitResponse,
  BrainstormRenameCategoryResponse,
  BrainstormSetCategoryResponse,
  BrainstormSubmitIdeaCommentResponse,
  BrainstormSubmitIdeaHeartResponse,
  BrainstormSubmitResponse,
  BrainstormToggleAllowCommentResponse,
  BrainstormToggleAllowHeartResponse,
  BrainstormToggleParticipantNameResponse,
  ChangeBoardBackgroundTypeResponse,
  HostChangeBoardEventResponse,
  ParticipantChangeBoardResponse,
  RemoveIdeaDocumentResponse,
  ToggleBlurBackgroundImageResponse,
} from 'src/app/services/backend/schema/event-responses';
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
  oldServerMessage: UpdateMessage;
  serverOffsets: number[];
  avgServerTimeOffset: number;
  facilitatorConnected = false;
  timer;

  participantCode: number;

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
    if (localStorage.getItem('host_' + this.roomCode)) {
      LogRocket.identify(localStorage);
      this.permissionsService.loadPermissions(['ADMIN']);
    } else if (localStorage.getItem('participant_' + this.roomCode)) {
      this.permissionsService.loadPermissions(['PARTICIPANT']);
      this.clientType = 'participant';
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

  ngOnChanges() {}

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
    if (msg.eventtype === EventTypes.notificationEvent) {
      this.serverMessage = {
        ...this.serverMessage,
        notifications: msg.notifications,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormToggleParticipantNameEvent) {
      this.contextService.changeBoardToggleParticipantName(
        msg.event_msg as BrainstormToggleParticipantNameResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.participantChangeBoardEvent) {
      this.contextService.changeParticipantBoardInActivityState(
        msg.event_msg as ParticipantChangeBoardResponse,
        this.oldServerMessage,
        this.participantCode
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.hostChangeBoardEvent) {
      this.contextService.changeHostBoardInActivityState(
        msg.event_msg as HostChangeBoardEventResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormSubmitIdeaCommentEvent) {
      this.serverMessage = {
        event_msg: msg.event_msg,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
      this.contextService.addCommentToActivityState(
        msg.event_msg as BrainstormSubmitIdeaCommentResponse,
        this.oldServerMessage
      );
    } else if (msg.eventtype === EventTypes.brainstormRemoveIdeaCommentEvent) {
      this.contextService.removeCommentFromActivityState(
        msg.event_msg as BrainstormRemoveIdeaCommentResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormBoardSortOrderEvent) {
      this.contextService.changeBoardSortOrder(
        msg.event_msg as BrainstormBoardSortOrderResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormToggleAllowCommentEvent) {
      this.contextService.brainstormToggleAllowComment(
        msg.event_msg as BrainstormToggleAllowCommentResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormToggleAllowHeartEvent) {
      this.contextService.brainstormToggleAllowHeart(
        msg.event_msg as BrainstormToggleAllowHeartResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormSubmitIdeaHeartEvent) {
      this.contextService.brainstormSubmitIdeaHeart(
        msg.event_msg as BrainstormSubmitIdeaHeartResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormRemoveIdeaHeartEvent) {
      this.contextService.brainstormRemovedIdeaHeart(
        msg.event_msg as BrainstormRemoveIdeaHeartResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormChangeModeEvent) {
      this.contextService.brainstormChangeMode(
        msg.event_msg as BrainstormChangeModeResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormChangeBoardStatusEvent) {
      this.contextService.changeBoardStatus(
        msg.event_msg as BrainstormChangeBoardStatusResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormSubmitEvent) {
      this.contextService.addIdea(msg.event_msg as BrainstormSubmitResponse, this.oldServerMessage);
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormRemoveSubmissionEvent) {
      this.contextService.removeIdea(msg.event_msg as BrainstormRemoveSubmitResponse, this.oldServerMessage);
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.removeIdeaDocumentEvent) {
      this.contextService.removeIdeaDocument(
        msg.event_msg as RemoveIdeaDocumentResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormEditIdeaSubmitEvent) {
      this.contextService.editIdea(msg.event_msg as BrainstormEditResponse, this.oldServerMessage);
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormCreateCategoryEvent) {
      this.contextService.createCategory(
        msg.event_msg as BrainstormCreateCategoryResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormRemoveCategoryEvent) {
      this.contextService.removeCategory(
        msg.event_msg as BrainstormRemoveCategoryResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormRenameCategoryEvent) {
      this.contextService.renameCategory(
        msg.event_msg as BrainstormRenameCategoryResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormAddBoardEventBaseEvent) {
      this.contextService.addBoard(msg.event_msg as BrainstormAddBoardResponse, this.oldServerMessage);
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.duplicateBoardEvent) {
      this.contextService.duplicateBoard(msg.event_msg as Board, this.oldServerMessage);
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormRemoveBoardEvent) {
      this.contextService.removeBoard(msg.event_msg as BrainstormRemoveBoardResponse, this.oldServerMessage);
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormAddIdeaPinEvent) {
      this.contextService.addPinIdea(
        msg.event_msg as BrainstormAddRemoveIdeaPinResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormRemoveIdeaPinEvent) {
      this.contextService.removePinIdea(
        msg.event_msg as BrainstormAddRemoveIdeaPinResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
      // } else if (msg.eventtype === EventTypes.brainstormRearrangeBoardEvent) {
      // } else if (msg.eventtype === EventTypes.brainstormMoveIdeaBoardEvent) {
      // } else if (msg.eventtype === EventTypes.moveBrainstormIdeaEvent) {
    } else if (msg.eventtype === EventTypes.brainstormSubmitReplyReviewCommentEvent) {
      this.serverMessage = {
        ...msg.event_msg,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
      // } else if (msg.eventtype === EventTypes.brainstormSubmitCommentHeartEvent) {
      // } else if (msg.eventtype === EventTypes.brainstormRemoveReplyReviewCommentEvent) {
      // } else if (msg.eventtype === EventTypes.brainstormRemoveCommentHeartEvent) {
    } else if (msg.eventtype === EventTypes.brainstormSetCategoryEvent) {
      this.contextService.setPostCategory(
        msg.event_msg as BrainstormSetCategoryResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormBoardBackgroudEvent) {
      this.contextService.brainstormBoardBackground(
        msg.event_msg as BrainstormBoardBackgroundResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.changeBoardBackgroundTypeEvent) {
      this.contextService.changeBoardBackgroundType(
        msg.event_msg as ChangeBoardBackgroundTypeResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.toggleBlurBackgroundImageEvent) {
      this.contextService.toggleBlurBackgroundImage(
        msg.event_msg as ToggleBlurBackgroundImageResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.brainstormBoardPostSizeEvent) {
      this.contextService.changePostSize(
        msg.event_msg as BrainstormBoardPostSizeResponse,
        this.oldServerMessage
      );
      this.serverMessage = {
        ...this.oldServerMessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
    } else if (msg.eventtype === EventTypes.joinEvent) {
      this.participantCode = this.setParticipantCode();
      this.facilitatorConnected = true;
      this.serverMessage = {
        ...msg.updatemessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
      this.oldServerMessage = cloneDeep(this.serverMessage);
    } else {
      // if that event is not optimized
      if (msg.updatemessage) {
        this.serverMessage = {
          ...msg.updatemessage,
          eventType: msg.eventtype,
          isHost: this.clientType === 'participant' ? false : true,
        };
        this.oldServerMessage = cloneDeep(this.serverMessage);
      }
      this.participantCode = this.setParticipantCode();
      this.facilitatorConnected = true;
    }

    if (msg.clienterror !== null && msg.clienterror !== undefined) {
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
    } else if (msg.updatemessage !== null && msg.updatemessage !== undefined) {
      this.facilitatorConnected = true;
      this.serverMessage = {
        ...msg.updatemessage,
        eventType: msg.eventtype,
        isHost: this.clientType === 'participant' ? false : true,
      };
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

  getEventType() {
    // console.log(this.serverMessage);
  }

  public getParticipantCode(): number {
    return this.participantCode;
  }

  private setParticipantCode(): number {
    let details: Participant;
    const lessonRunCode = this.roomCode;
    if (localStorage.getItem('participant_' + lessonRunCode)) {
      details = JSON.parse(localStorage.getItem('participant_' + lessonRunCode));
      return details.participant_code;
    }
  }
}

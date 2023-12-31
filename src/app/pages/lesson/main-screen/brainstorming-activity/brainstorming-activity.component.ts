import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { iframely } from '@iframely/embed.js';
import { cloneDeep, forOwn } from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable } from 'rxjs';
import {
  BrainstormEventService,
  BrainstormService,
  ContextService,
  SharingToolService,
} from 'src/app/services';
import {
  Board,
  BoardMode,
  BoardStatus,
  BrainstormActivity,
  EventTypes,
  Group,
  HostChangeBoardEvent,
  Idea,
  ParticipantChangeBoardEvent,
  QueryParamsObject,
  Timer,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import {
  BrainstormRemoveIdeaCommentResponse,
  BrainstormSubmitIdeaCommentResponse,
  BrainstormToggleParticipantNameResponse,
  HostChangeBoardEventResponse,
  ParticipantChangeBoardResponse,
} from 'src/app/services/backend/schema/event-responses';
import { BoardBackgroundService } from 'src/app/services/board-background.service';
import { BoardStatusService } from 'src/app/services/board-status.service';
import { LessonService } from 'src/app/services/lesson.service';
import { TopicMediaService } from 'src/app/services/topic-media.service';
import { ParticipantGroupingInfoDialogComponent } from 'src/app/shared/dialogs/participant-grouping-info-dialog/participant-grouping-info.dialog';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-brainstorming-activity',
  templateUrl: './brainstorming-activity.component.html',
})
export class MainScreenBrainstormingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  @Input() activityStage: Observable<string>;
  @Output() firstLaunchEvent = new EventEmitter<string>();
  _activityState: UpdateMessage;
  showParticipantUI = false;
  showParticipantsGroupsDropdown = false;
  participantCode: number;
  htmlData2 = `<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://www.shutterstock.com/image-illustration/white-arrow-fall-down-on-background-1323403484" data-iframely-url="//cdn.iframe.ly/qYVUNqp?iframe=card-small"></a></div></div>`;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService,
    private lessonService: LessonService,
    private brainstormService: BrainstormService,
    private brainstormEventService: BrainstormEventService,
    private permissionsService: NgxPermissionsService,
    private boardStatusService: BoardStatusService,
    private topicMediaService: TopicMediaService,
    private title: Title,
    private boardBackgroundService: BoardBackgroundService
  ) {
    super();
    iframely.load();
  }
  instructions = '';
  sub_instructions = '';
  timer: Timer;
  act: BrainstormActivity;

  submissionScreen = false;
  voteScreen = false;
  VnSComplete = false;
  showUserName = true;
  minWidth = 'small';
  colDeleted = 0;
  joinedUsers = [];
  answeredParticipants = [];
  unansweredParticipants = [];
  ideaSubmittedUsersCount = 0;
  voteSubmittedUsersCount = 0;
  dialogRef: MatDialogRef<ParticipantGroupingInfoDialogComponent>;
  shownSubmissionCompleteNofitication = false;

  // Groupings
  classificationTypes;
  participantGroups: Array<Group>;
  selectedClassificationType;
  selectedParticipantGroup: Group;
  myGroup: Group;

  imagesURLs = [
    'localhost/media/Capture_LGXPk9s.JPG',
    'localhost/media/Capture_LGXPk9s.JPG',
    '../../../../../assets//img/Desk_lightblue2.jpg',
  ];

  settingsSubscription;
  saveIdeaSubscription;
  imagesList: FileList;
  imageSrc;
  imageDialogRef;
  selectedImageUrl;

  selectedBoardIndex = 0;
  selectedBoard: Board;
  boardMode: BoardMode;
  isHost: boolean;

  participant_set = [];
  queryParamSubscription;

  ngOnInit() {
    super.ngOnInit();

    const el = document.getElementById('rt');
    iframely.load(el);

    this.queryParamSubscription = this.activatedRoute.queryParams.subscribe((p: QueryParamsObject) => {
      if (p.board) {
        // tslint:disable-next-line:radix
        this.changeBoardToParamsBoard(parseInt(p.board));
      }
    });
    this.participantCode = this.getParticipantCode();
    this.act = this.activityState.brainstormactivity;

    this.eventType = this.getEventType();

    this.selectUserBoard();

    this.initBoardInstructions();

    // get the new boardmode whenever board is changed
    this.brainstormService.selectedBoard$.subscribe((val: Board) => {
      if (val) {
        this.boardMode = val.board_activity.mode;
      }
    });

    this.brainstormService.selectedBoard$.subscribe((val: Board) => {
      if (val) {
        this.updateBackgroundInService(val);
      }
    });

    this.changeBoardStatus();
    this.title.setTitle(this.activityState?.lesson_run?.lesson?.lesson_name ?? 'Benji');
  }

  updateBackgroundInService(board: Board) {
    this.boardBackgroundService.boardBackgroundType = board.board_activity.background_type;
    if (board?.board_activity?.background_type === 'none') {
    } else if (board.board_activity.background_type === 'color') {
      this.boardBackgroundService.boardBackgroundColor = board.board_activity.color;
    } else if (board.board_activity.background_type === 'image') {
      this.boardBackgroundService.boardBackgroundImage =
        board.board_activity.image_upload ?? board.board_activity.image_url;
      this.boardBackgroundService.blurBackgroundImage = board.board_activity.blur_image;
    }
  }

  ngAfterViewInit(): void {
    const currentLessonRunCode = this.activityState.lesson_run.lessonrun_code.toString();
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        if (localStorage.getItem('currentLessonRunCode' + currentLessonRunCode) !== currentLessonRunCode) {
          this.firstLaunchEvent.emit();
          localStorage.setItem('currentLessonRunCode' + currentLessonRunCode, currentLessonRunCode);
        }
      }
    });
  }

  ngOnChanges() {
    this.onChanges();
  }

  onChanges() {
    this.isHost = this.activityState.isHost;
    const currentEventType = this.getEventType();
    if (currentEventType !== EventTypes.notificationEvent) {
      // prevent changes down the tree when it is BrainstormSubmitIdeaCommentEvent
      this.eventType = currentEventType;
      this._activityState = this.activityState;
      // update available activity state when it is none of above events
      this.brainstormEventService.activityState = this._activityState;
    }
    const act = this.activityState.brainstormactivity;
    this.act = cloneDeep(this.activityState.brainstormactivity);
    if (
      currentEventType === 'BrainstormEditBoardInstruction' ||
      currentEventType === 'BrainstormEditSubInstruction'
    ) {
      this.selectUserBoard();
    } else if (currentEventType === 'UpdatePromptVideoEvent') {
      this.updatePromptMedia();
    } else if (currentEventType === EventTypes.joinEvent) {
      this.detectNewParticipantJoined(this.activityState);
      this.selectUserBoard();
      this.updateLessonInfo();
      // set meeting mode at the start
      this.updateMeetingMode();
    } else if (currentEventType === EventTypes.hostChangeBoardEvent) {
      this.eventType = currentEventType;
      this.hostChangedBoard();
      this.updatePromptMedia();
    } else if (currentEventType === EventTypes.participantChangeBoardEvent) {
      this.eventType = currentEventType;
      this.participantChangedBoard();
      this.changeBoardStatus();
      this.updatePromptMedia();
    } else if (currentEventType === 'BrainstormChangeModeEvent') {
      this.getNewBoardMode(act, (mode) => {
        this.boardMode = mode;
        this.brainstormService.boardMode = this.boardMode;
      });
    } else if (currentEventType === EventTypes.brainstormChangeBoardStatusEvent) {
      this.changeBoardStatus();
      this.selectUserBoard();
    } else if (currentEventType === 'BrainstormAddBoardEventBaseEvent') {
      if (this.isHost) {
        this.navigateToNewlyAddedBoard();
      }
    } else if (currentEventType === EventTypes.brainstormToggleMeetingMode) {
      this.updateMeetingMode();
      this.bringUsersToHostBoard();
    } else if (this.activityState.eventType === EventTypes.getUpdatedLessonDetailEvent) {
      this.updateLessonInfo();
    } else if (this.activityState.eventType === EventTypes.notificationEvent) {
      this.updateNotifications();
    } else if (
      currentEventType === EventTypes.brainstormBoardBackgroudEvent ||
      currentEventType === EventTypes.changeBoardBackgroundTypeEvent ||
      currentEventType === EventTypes.toggleBlurBackgroundImageEvent
    ) {
      this.getUserBoard((b: Board) => {
        this.updateBackgroundInService(b);
      });
    } else {
      this.selectUserBoard();
    }
  }

  public boardChangingQueryParams(boardId: number) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { board: boardId },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy() {
    this.contextService.destroyActivityTimer();
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
    if (this.saveIdeaSubscription) {
      this.saveIdeaSubscription.unsubscribe();
    }
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
  }

  changeBoardStatus() {
    this.getBoardStatus(this.act, (status: BoardStatus) => {
      this.updateBoardStatus(status);
    });
  }

  bringUsersToHostBoard() {
    if (this.act.meeting_mode) {
      this.selectedBoard = this.getAdminBoard();
      this.brainstormService.selectedBoard = this.selectedBoard;
      this.boardChangingQueryParams(this.selectedBoard.id);
    }
  }

  updateMeetingMode() {
    this.brainstormService.meetingMode = this.activityState.brainstormactivity.meeting_mode;
  }

  updateLessonInfo() {
    this.title.setTitle(this.activityState?.lesson_run?.lesson?.lesson_name ?? 'Benji');
    this.brainstormService.lessonName = this.activityState.lesson_run.lesson.lesson_name;
    this.brainstormService.lessonDescription = this.activityState.lesson_run.lesson.lesson_description;
    this.brainstormService.lessonImage = this.lessonService.setCoverPhoto(
      this.activityState.lesson_run.lessonrun_images
    );
  }

  updateNotifications() {
    this.brainstormEventService.notifications = this.activityState?.notifications;
  }

  hostChangedBoard() {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.brainstormEventService.hostBoardId = this.act.host_board;
        this.selectedBoard = this.getAdminBoard();
        this.brainstormService.selectedBoard = this.selectedBoard;
        this.boardChangingQueryParams(this.selectedBoard.id);
        this.updateBoardStatus(this.selectedBoard.status);
      }
    });
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        if (this._activityState.brainstormactivity.meeting_mode) {
          this.brainstormEventService.participantBoardId = this.act.host_board;
          this.selectedBoard = this.getAdminBoard();
          this.brainstormService.selectedBoard = this.selectedBoard;
          this.boardChangingQueryParams(this.selectedBoard.id);
          this.updateBoardStatus(this.selectedBoard.status);
        }
      }
    });
  }

  updateBoardStatus(status: BoardStatus) {
    this.boardStatusService.boardStatus = status;
  }

  participantChangedBoard() {
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.selectedBoard = this.brainstormService.getParticipantBoard(
          this._activityState.brainstormactivity,
          this.participantCode
        );

        this.brainstormService.selectedBoard = this.selectedBoard;
        this.boardChangingQueryParams(this.selectedBoard.id);
        this.updateBoardStatus(this.selectedBoard.status);
      }
    });
  }

  updatePromptMedia() {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        const board = this.getAdminBoard();
        this.topicMediaService.topicMedia = board?.prompt_video;
      }
    });
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        let board: Board;
        board = this.brainstormService.getParticipantBoard(
          this.activityState.brainstormactivity,
          this.participantCode
        );
        this.topicMediaService.topicMedia = board?.prompt_video;
      }
    });
  }

  navigateToNewlyAddedBoard() {
    const sortedBoards = [...this.act.boards].sort((a, b) => b.id - a.id);
    if (sortedBoards[0]) {
      this.sendMessage.emit(new HostChangeBoardEvent(sortedBoards[0].id));
    }
  }

  initBoardInstructions() {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        const board = this.getAdminBoard();
        this.brainstormService.boardTitle = board.board_activity.instructions;
        this.brainstormService.boardInstructions = board.board_activity.sub_instructions;
      }
    });
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        const board = this.brainstormService.getParticipantBoard(
          this._activityState.brainstormactivity,
          this.participantCode
        );
        this.brainstormService.boardTitle = board.board_activity.instructions;
        this.brainstormService.boardInstructions = board.board_activity.sub_instructions;
      }
    });
  }

  selectUserBoard() {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.selectedBoard = this.getAdminBoard();
        this.brainstormService.selectedBoard = this.selectedBoard;
        this.boardChangingQueryParams(this.selectedBoard.id);
      }
    });
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        const selectedBoard = this.brainstormService.getParticipantBoard(
          this.activityState.brainstormactivity,
          this.participantCode
        );
        if (selectedBoard) {
          this.selectedBoard = selectedBoard;
          this.brainstormService.selectedBoard = this.selectedBoard;
          this.boardChangingQueryParams(this.selectedBoard.id);
        }
      }
    });
  }

  getUserBoard(callback) {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        const c = this.getAdminBoard();
        callback(c);
      }
    });
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        const selectedBoard = this.brainstormService.getParticipantBoard(
          this.activityState.brainstormactivity,
          this.participantCode
        );
        callback(selectedBoard);
      }
    });
  }

  changeBoardToParamsBoard(paramBoardId) {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.selectedBoard = this.getAdminBoard();
        if (this.selectedBoard.id === paramBoardId) {
          // we're on the right board
        } else {
          // this.changeAdminBoard(paramBoardId);
          this.sendMessage.emit(new HostChangeBoardEvent(paramBoardId));
        }
      }
    });
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        let boardId: number;
        if (this.brainstormEventService.participantBoardId) {
          boardId = this.brainstormEventService.participantBoardId;
        } else if (this._activityState.brainstormactivity) {
          boardId = this.brainstormService.getParticipantBoard(
            this._activityState.brainstormactivity,
            this.participantCode
          ).id;
        } else {
          // get participant board id from event service
          boardId = this.brainstormService.getParticipantBoardFromList(
            this._activityState.brainstormactivity.boards,
            this.brainstormEventService.participantBoardId
          ).id;
        }

        if (boardId === paramBoardId) {
          // we're on the right board
        } else {
          // this.changeParticipantBoard(paramBoardId);
          this.sendMessage.emit(new ParticipantChangeBoardEvent(paramBoardId));
        }
      }
    });
  }

  getAdminBoard() {
    let selectedBoard: Board;
    const hostBoardID = this.activityState.brainstormactivity.host_board;
    if (hostBoardID) {
      this.activityState.brainstormactivity.boards.forEach((v) => {
        if (hostBoardID === v.id) {
          selectedBoard = v;
        }
      });
    }
    return selectedBoard;
  }

  getNewBoardMode(act: BrainstormActivity, onSuccess) {
    let mode: BoardMode;
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.selectedBoard = this.getAdminBoard();
        mode = this.selectedBoard.board_activity.mode;
        onSuccess(mode);
      }
    });
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.selectedBoard = this.brainstormService.getParticipantBoard(
          this._activityState.brainstormactivity,
          this.participantCode
        );
        mode = this.selectedBoard.board_activity.mode;
        onSuccess(mode);
      }
    });
  }

  getBoardStatus(act: BrainstormActivity, onSuccess): void {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        const board = this.getAdminBoard();
        onSuccess(board.status);
      }
    });
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        const board = this.brainstormService.getParticipantBoard(
          this._activityState.brainstormactivity,
          this.participantCode
        );
        onSuccess(board.status);
      }
    });
  }

  detectNewParticipantJoined(act: UpdateMessage) {
    if (this.participant_set.length === act.lesson_run.participant_set.length) {
      return;
    } else {
      this.participant_set = act.lesson_run.participant_set;
    }
  }

  getPersonName(idea: Idea) {
    if (idea && idea.submitting_participant) {
      const user = this.joinedUsers.find(
        (u) => u.participant_code === idea.submitting_participant.participant_code
      );
      return user.display_name;
    }
  }

  getUsersIdeas(act: BrainstormActivity): Array<Idea> {
    let arr: Array<Idea> = [];
    arr = arr.filter(
      (v, i, s) => i === s.findIndex((t) => t.submitting_participant === v.submitting_participant)
    );
    return arr;
  }

  sendSocketMessage($event) {
    this.sendMessage.emit($event);
  }

  getBoard() {}
}

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
import { BoardStatusService } from 'src/app/services/board-status.service';
import { TopicMediaService } from 'src/app/services/topic-media.service';
import { ParticipantGroupingInfoDialogComponent } from 'src/app/shared/dialogs/participant-grouping-info-dialog/participant-grouping-info.dialog';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-brainstorming-activity',
  templateUrl: './brainstorming-activity.component.html',
  styleUrls: ['./brainstorming-activity.component.scss'],
})
export class MainScreenBrainstormingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() peakBackState = false;
  @Input() activityStage: Observable<string>;
  @Output() firstLaunchEvent = new EventEmitter<string>();
  _activityState: UpdateMessage;
  peakBackStage = null;
  showParticipantUI = false;
  showParticipantsGroupsDropdown = false;
  participantCode;
  htmlData2 = `<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://www.shutterstock.com/image-illustration/white-arrow-fall-down-on-background-1323403484" data-iframely-url="//cdn.iframe.ly/qYVUNqp?iframe=card-small"></a></div></div>`;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService,
    private sharingToolService: SharingToolService,
    private brainstormService: BrainstormService,
    private brainstormEventService: BrainstormEventService,
    private permissionsService: NgxPermissionsService,
    private boardStatusService: BoardStatusService,
    private topicMediaService: TopicMediaService,
    private title: Title
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

    this.changeBoardStatus();
    this.title.setTitle(this.activityState?.lesson_run?.lesson?.lesson_name ?? 'Benji');
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
    if (currentEventType !== EventTypes.brainstormSubmitIdeaCommentEvent) {
      // prevent changes down the tree when it is BrainstormSubmitIdeaCommentEvent
      this.eventType = currentEventType;
      this._activityState = this.activityState;
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
    } else if (currentEventType === EventTypes.hostChangeBoardEvent) {
      this.hostChangedBoard();
      this.changeBoardStatus();
      this.updatePromptMedia();
    } else if (currentEventType === EventTypes.participantChangeBoardEvent) {
      this.participantChangedBoard();
      this.changeBoardStatus();
      this.updatePromptMedia();
    } else if (currentEventType === 'BrainstormChangeModeEvent') {
      this.getNewBoardMode(act, (mode) => {
        this.boardMode = mode;
        this.brainstormService.boardMode = this.boardMode;
      });
    } else if (currentEventType === 'BrainstormChangeBoardStatusEvent') {
      this.changeBoardStatus();
      this.selectUserBoard();
    } else if (currentEventType === 'BrainstormAddBoardEventBaseEvent') {
      if (this.isHost) {
        this.navigateToNewlyAddedBoard();
      }
    } else if (currentEventType === EventTypes.brainstormSubmitIdeaCommentEvent) {
      // update the data in service. no children components will fire ngonchanges
      this.brainstormEventService.ideaCommentEvent = this.activityState;
    } else if (currentEventType === EventTypes.brainstormToggleMeetingMode) {
      this.updateMeetingMode();
    } else if (this.activityState.eventType === EventTypes.getUpdatedLessonDetailEvent) {
      this.updateLessonInfo();
    }
    // else if (this.activityState.eventType === EventTypes.brainstormChangeModeEvent) {
    //   console.log('hi');
    //   this.selectUserBoard();
    // }
    else {
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
      this.boardStatusService.boardStatus = status;
    });
  }

  updateMeetingMode() {
    this.brainstormService.meetingMode = this.activityState.brainstormactivity.meeting_mode;
  }

  updateLessonInfo() {
    this.brainstormService.lessonName = this.activityState.lesson.lesson_name;
    this.brainstormService.lessonDescription = this.activityState.lesson.lesson_description;
  }

  hostChangedBoard() {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.selectedBoard = this.getAdminBoard();
        this.brainstormService.selectedBoard = this.selectedBoard;
        this.boardChangingQueryParams(this.selectedBoard.id);
      }
    });
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        if (this.act.meeting_mode) {
          this.selectedBoard = this.brainstormService.getParticipantBoard(this.act, this.participantCode);
          this.brainstormService.selectedBoard = this.selectedBoard;
          this.boardChangingQueryParams(this.selectedBoard.id);
        }
      }
    });
  }

  participantChangedBoard() {
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.selectedBoard = this.brainstormService.getParticipantBoard(this.act, this.participantCode);
        this.brainstormService.selectedBoard = this.selectedBoard;
        this.boardChangingQueryParams(this.selectedBoard.id);
      }
    });
  }

  updatePromptMedia() {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        const board = this.getAdminBoard();
        this.topicMediaService.topicMedia = board.prompt_video;
      }
    });
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        const board = this.brainstormService.getParticipantBoard(this.act, this.participantCode);
        this.topicMediaService.topicMedia = board.prompt_video;
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
        const board = this.brainstormService.getParticipantBoard(this.act, this.participantCode);
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
        const selectedBoard = this.brainstormService.getParticipantBoard(this.act, this.participantCode);
        if (selectedBoard) {
          this.selectedBoard = selectedBoard;
          this.brainstormService.selectedBoard = this.selectedBoard;
          this.boardChangingQueryParams(this.selectedBoard.id);
        }
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
        this.selectedBoard = this.brainstormService.getParticipantBoard(this.act, this.participantCode);
        if (this.selectedBoard.id === paramBoardId) {
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
    const hostBoardID = this.act.host_board;
    if (hostBoardID) {
      this.act.boards.forEach((v) => {
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
        this.selectedBoard = this.brainstormService.getParticipantBoard(this.act, this.participantCode);
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
        const board = this.brainstormService.getParticipantBoard(this.act, this.participantCode);
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
}

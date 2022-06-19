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
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep, forOwn } from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { BrainstormService, ContextService, SharingToolService } from 'src/app/services';
import {
  Board,
  BoardMode,
  BoardStatus,
  BrainstormActivity,
  Group,
  HostChangeBoardEvent,
  Idea,
  ParticipantChangeBoardEvent,
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
  peakBackStage = null;
  showParticipantUI = false;
  showParticipantsGroupsDropdown = false;
  participantCode;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService,
    private sharingToolService: SharingToolService,
    private brainstormService: BrainstormService,
    private permissionsService: NgxPermissionsService,
    private boardStatusService: BoardStatusService,
    private topicMediaService: TopicMediaService
  ) {
    super();
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

  participant_set = [];

  ngOnInit() {
    super.ngOnInit();
    const paramBoardId = this.activatedRoute.snapshot.queryParams['board'];
    if (paramBoardId) {
      // tslint:disable-next-line:radix
      this.changeBoardToParamsBoard(parseInt(paramBoardId));
    }
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
    this.onChanges();
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
    this.eventType = this.getEventType();
    const act = this.activityState.brainstormactivity;
    this.act = cloneDeep(this.activityState.brainstormactivity);
    if (
      this.eventType === 'BrainstormEditBoardInstruction' ||
      this.eventType === 'BrainstormEditSubInstruction'
    ) {
      this.selectUserBoard();
    } else if (this.eventType === 'UpdatePromptVideoEvent') {
      this.updatePromptMedia();
    } else if (this.eventType === 'JoinEvent') {
      this.detectNewParticipantJoined(this.activityState);
      this.selectUserBoard();
    } else if (this.eventType === 'HostChangeBoardEvent') {
      this.hostChangedBoard();
      this.initBoardInstructions();
      this.changeBoardStatus();
      this.updatePromptMedia();
    } else if (this.eventType === 'ParticipantChangeBoardEvent') {
      this.participantChangedBoard();
      this.initBoardInstructions();
      this.changeBoardStatus();
      this.updatePromptMedia();
    } else if (this.eventType === 'BrainstormChangeModeEvent') {
      this.getNewBoardMode(act, (mode) => {
        this.boardMode = mode;
      });
    } else if (this.eventType === 'BrainstormChangeBoardStatusEvent') {
      this.changeBoardStatus();
      this.selectUserBoard();
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
  }

  changeBoardStatus() {
    this.getBoardStatus(this.act, (status: BoardStatus) => {
      this.boardStatusService.boardStatus = status;
    });
  }

  hostChangedBoard() {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.selectedBoard = this.getAdminBoard();
        this.brainstormService.selectedBoard = this.selectedBoard;
        this.boardChangingQueryParams(this.selectedBoard.id);
      }
    });
    if (this.act.meeting_mode) {
      this.selectedBoard = this.getParticipantBoard();
      this.brainstormService.selectedBoard = this.selectedBoard;
      this.boardChangingQueryParams(this.selectedBoard.id);
    }
  }

  participantChangedBoard() {
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.selectedBoard = this.getParticipantBoard();
        this.brainstormService.selectedBoard = this.selectedBoard;
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
        const board = this.getParticipantBoard();
        this.topicMediaService.topicMedia = board.prompt_video;
      }
    });
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
        const board = this.getParticipantBoard();
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
        this.selectedBoard = this.getParticipantBoard();
        this.brainstormService.selectedBoard = this.selectedBoard;
        this.boardChangingQueryParams(this.selectedBoard.id);
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
        this.selectedBoard = this.getParticipantBoard();
        if (this.selectedBoard.id === paramBoardId) {
          // we're on the right board
        } else {
          // this.changeParticipantBoard(paramBoardId);
          this.sendMessage.emit(new ParticipantChangeBoardEvent(paramBoardId));
        }
      }
    });
  }

  getParticipantBoard() {
    let selectedBoard: Board;
    const boardParticipants = this.act.participants;
    if (boardParticipants) {
      forOwn(boardParticipants, (boardParticipantArray, participantsBoardId) => {
        for (let i = 0; i < boardParticipantArray.length; i++) {
          const participantCode = boardParticipantArray[i];
          if (participantCode === this.participantCode) {
            this.act.boards.forEach((board) => {
              if (Number(participantsBoardId) === board.id) {
                selectedBoard = board;
              }
            });
          }
        }
      });
    }
    return selectedBoard;
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
        this.selectedBoard = this.getParticipantBoard();
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
        const board = this.getParticipantBoard();
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

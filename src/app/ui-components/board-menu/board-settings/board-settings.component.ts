import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { NgxPermissionsService } from 'ngx-permissions';
import { BrainstormService } from 'src/app';
import {
  Board,
  BoardMode,
  BoardSort,
  BoardStatus,
  BoardTypes,
  BrainstormBoardSortOrderEvent,
  BrainstormChangeBoardStatusEvent,
  BrainstormChangeModeEvent,
  BrainstormClearBoardIdeaEvent,
  BrainstormToggleAllowCommentEvent,
  BrainstormToggleAllowHeartEvent,
  BrainstormToggleMeetingMode,
  BrainstormToggleParticipantNameEvent,
  EventTypes,
  SettingsTypes,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { BoardStatusService } from 'src/app/services/board-status.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.dialog';

@Component({
  selector: 'benji-board-settings',
  templateUrl: 'board-settings.component.html',
})
export class BoardSettingsComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  @Input() sidenav: MatSidenav;
  @Input() navType: string;
  @Input() boardType: BoardTypes;
  @Input() allowedSettings: Array<SettingsTypes> = [];

  @Output() sendMessage = new EventEmitter<any>();
  postOrderDropdown: Array<{ value: BoardSort; name: string }> = [
    {
      value: 'newest_to_oldest',
      name: 'Newest to oldest',
    },
    {
      value: 'oldest_to_newest',
      name: 'Oldest to newest',
    },
    {
      value: 'likes',
      name: 'Likes',
    },
    {
      value: 'unsorted',
      name: 'Unsorted',
    },
  ];
  boardStatusDropdown: Array<{ value: BoardStatus; name: string }> = [
    {
      value: 'open',
      name: 'Open',
    },
    {
      value: 'closed',
      name: 'Hidden',
    },
    {
      value: 'view_only',
      name: 'View Only',
    },
    {
      value: 'private',
      name: 'Private',
    },
  ];
  defaultSort = 'newest_to_oldest';
  participants = [];

  meetingMode: boolean;
  showAuthorship: boolean;
  allowCommenting: boolean;
  allowHearting: boolean;
  board: Board;
  boardMode: BoardMode;
  gridMode: boolean;
  threadMode: boolean;
  columnsMode: boolean;
  currentboardStatus: BoardStatus;
  selectedBoard: Board;
  boards: Array<Board> = [];

  hostname = window.location.host + '/participant/join?link=';
  boardsCount: number;
  menuBoard: any;
  hostBoard: number;

  showBottom = true;
  settingTypes = SettingsTypes;

  constructor(
    private dialog: MatDialog,
    private brainstormService: BrainstormService,
    private boardStatusService: BoardStatusService,
    private permissionsService: NgxPermissionsService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.brainstormService.selectedBoard$.subscribe((board: Board) => {
      if (board) {
        this.selectedBoardChanged(board);
      }
    });

    this.boardStatusService.boardStatus$.subscribe((status: BoardStatus) => {
      if (status) {
        this.currentboardStatus = status;
      }
    });

    this.meetingMode = this.activityState.brainstormactivity.meeting_mode;

    this.hostBoard = this.activityState.brainstormactivity.host_board;

    if (!this.hostname.includes('localhost')) {
      this.hostname = 'https://' + this.hostname;
    }
  }

  selectedBoardChanged(board) {
    this.selectedBoard = board;
    this.boardMode = this.selectedBoard.board_activity.mode;
    this.decideBoardMode(this.boardMode);
    this.showAuthorship = this.selectedBoard.board_activity.show_participant_name_flag;
    this.allowCommenting = this.selectedBoard.allow_comment;
    this.allowHearting = this.selectedBoard.allow_heart;
    this.currentboardStatus = board.status;
    if (board.sort) {
      this.defaultSort = board.sort;
    }
  }

  ngOnChanges(): void {
    if (
      this.activityState.eventType === 'BrainstormRemoveBoardEvent' ||
      this.activityState.eventType === 'BrainstormAddBoardEventBaseEvent'
    ) {
      this.resetBoards();
    } else if (this.activityState.eventType === 'BrainstormChangeModeEvent') {
      if (this.selectedBoard && this.selectedBoard.board_activity.mode) {
        this.decideBoardMode(this.selectedBoard.board_activity.mode);
      }
    }
    if (this.navType === 'boards') {
      if (this.activityState.eventType === EventTypes.hostChangeBoardEvent) {
      } else if (this.activityState.eventType === EventTypes.brainstormToggleMeetingMode) {
        this.meetingMode = this.activityState.brainstormactivity.meeting_mode;
      } else {
      }
    }
    this.hostBoard = this.activityState.brainstormactivity.host_board;
    this.decideBoardMode(this.boardMode);
  }

  getBoardsForAdmin() {
    return this.activityState.brainstormactivity.boards.filter((board) => board.removed === false);
  }

  getBoardsForParticipant() {
    return this.activityState.brainstormactivity.boards.filter((board) => board.removed === false);
  }

  getBoardParticipantCodes(board: Board) {
    if (this.activityState.brainstormactivity.participants[board.id].length) {
      return this.activityState.brainstormactivity.participants[board.id];
    } else {
      return null;
    }
  }

  closeNav() {
    this.sidenav.close();
  }

  setBoardMode(mode: BoardMode) {
    this.sendMessage.emit(new BrainstormChangeModeEvent(mode, this.selectedBoard.id));
    this.decideBoardMode(mode);
  }

  decideBoardMode(mode: BoardMode): void {
    this.boardMode = mode;
    switch (mode) {
      case 'grid':
        this.gridMode = true;
        this.threadMode = false;
        this.columnsMode = false;
        break;
      case 'thread':
        this.gridMode = false;
        this.threadMode = true;
        this.columnsMode = false;
        break;
      default:
        this.gridMode = false;
        this.threadMode = false;
        this.columnsMode = true;
    }
  }

  duplicateBoard() {}

  setBoardStatus() {
    const selected = this.currentboardStatus;
    this.sendMessage.emit(
      new BrainstormChangeBoardStatusEvent(this.currentboardStatus, this.selectedBoard.id)
    );
  }

  toggleMeetingMode($event) {
    this.sendMessage.emit(new BrainstormToggleMeetingMode($event.currentTarget.checked));
  }

  toggleShowAuthorship() {
    this.sendMessage.emit(new BrainstormToggleParticipantNameEvent(this.selectedBoard.id));
  }

  toggleCommenting() {
    this.sendMessage.emit(new BrainstormToggleAllowCommentEvent(this.selectedBoard.id));
  }

  toggleHearting() {
    this.sendMessage.emit(new BrainstormToggleAllowHeartEvent(this.selectedBoard.id));
  }

  copyLink() {
    this.utilsService.copyToClipboard(this.hostname + this.activityState.lesson_run.lessonrun_code);
  }

  resetBoards() {
    this.boardsCount = 0;
    this.boards = this.boards.filter((board) => board.removed === false);
    this.boardsCount = this.boards.length;
  }

  setMenuBoard(board: Board) {
    this.menuBoard = board.id;
  }

  clearBoard() {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: 'Are you sure you want to delete all posts? This action can not be undone?',
          actionButton: 'Delete',
        },
        disableClose: true,
        panelClass: 'confirmation-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.sendMessage.emit(new BrainstormClearBoardIdeaEvent(this.selectedBoard.id));
        }
      });
  }

  changeOrder(order: { value: BoardSort; name: string }) {
    this.sendMessage.emit(new BrainstormBoardSortOrderEvent(order.value, this.selectedBoard.id));
  }

  mediaUploaded(event) {
    console.log(event);
  }
}

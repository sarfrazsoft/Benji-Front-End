import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { NgxPermissionsService } from 'ngx-permissions';
import { BrainstormService } from 'src/app';
import {
  Board,
  BoardSort,
  BoardStatus,
  BoardTypes,
  BrainstormAddBoardEventBaseEvent,
  BrainstormBoardSortOrderEvent,
  BrainstormChangeBoardStatusEvent,
  BrainstormChangeModeEvent,
  BrainstormClearBoardIdeaEvent,
  BrainstormEditInstructionEvent,
  BrainstormEditSubInstructionEvent,
  BrainstormRearrangeBoardEvent,
  BrainstormRemoveBoardEvent,
  BrainstormToggleMeetingMode,
  BrainstormToggleParticipantNameEvent,
  HostChangeBoardEvent,
  ParticipantChangeBoardEvent,
  SettingsTypes,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { BoardStatusService } from 'src/app/services/board-status.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.dialog';
import { isSet } from 'src/app/shared/util/value';

@Component({
  selector: 'benji-board-menu',
  templateUrl: 'board-menu.component.html',
})
export class BoardMenuComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  @Input() sidenav: MatSidenav;
  @Input() navType: string;
  @Output() sendMessage = new EventEmitter<any>();

  defaultSort = 'newest_to_oldest';
  participants = [];

  allowedSettings: Array<SettingsTypes> = [];
  boardSetttings: Array<SettingsTypes> = [
    SettingsTypes.TOPIC_MEDIA,
    SettingsTypes.BOARD_STATUS,
    SettingsTypes.POST,
    SettingsTypes.POST_ORDER,
    SettingsTypes.BOARD_MODE,
    SettingsTypes.ADMIN,
  ];

  pageSetttings = [SettingsTypes.BOARD_STATUS, SettingsTypes.ADMIN];

  meetingMode: boolean;
  showAuthorship: boolean;
  board: Board;
  boardMode: string;
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
  boardType: BoardTypes;
  boardTypes = BoardTypes;

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
    this.initializeBoards();
    this.hostBoard = this.activityState.brainstormactivity.host_board;

    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        // this.dragDisabled = true;
      }
    });

    if (!this.hostname.includes('localhost')) {
      this.hostname = 'https://' + this.hostname;
    }
  }

  selectedBoardChanged(board) {
    this.selectedBoard = board;
    this.boardMode = this.selectedBoard.board_activity.mode;
    this.showAuthorship = this.selectedBoard.board_activity.show_participant_name_flag;
    this.currentboardStatus = board.status;
    if (board.sort) {
      this.defaultSort = board.sort;
    }
    this.boardType = this.selectedBoard?.meta?.boardType
      ? this.selectedBoard?.meta?.boardType
      : this.boardTypes.POSTS;

    this.allowedSettings = this.boardType === this.boardTypes.PAGE ? this.pageSetttings : this.boardSetttings;
  }

  ngOnChanges(): void {
    if (
      this.activityState.eventType === 'BrainstormRemoveBoardEvent' ||
      this.activityState.eventType === 'BrainstormAddBoardEventBaseEvent'
    ) {
      // this.resetBoards();
    }
    if (this.navType === 'boards') {
      if (this.activityState.eventType === 'HostChangeBoardEvent') {
      } else if (this.activityState.eventType === 'BrainstormToggleMeetingMode') {
        this.meetingMode = this.activityState.brainstormactivity.meeting_mode;
      } else {
        this.initializeBoards();
      }
    }
    this.hostBoard = this.activityState.brainstormactivity.host_board;
  }

  initializeBoards() {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        const unSortedBoards: Array<Board> = this.getBoardsForAdmin();
        this.sortBoards(unSortedBoards);
      }
    });

    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        const unSortedBoards: Array<Board> = this.getBoardsForParticipant();
        this.sortBoards(unSortedBoards);
      }
    });
  }

  sortBoards(unSortedBoards: Array<Board>) {
    let firstBoard;
    for (let i = 0; i < unSortedBoards.length; i++) {
      const board = unSortedBoards[i];
      if (board.previous_board === null) {
        firstBoard = board;
      }
    }
    const boards: Array<Board> = [];
    boards.push(firstBoard);
    for (let i = 0; i < boards.length; i++) {
      const sortedBoard = boards[i];
      for (let j = 0; j < unSortedBoards.length; j++) {
        const unSortedBoard = unSortedBoards[j];
        if (sortedBoard.next_board === unSortedBoard.id) {
          boards.push(unSortedBoard);
          break;
        }
      }
    }
    this.boards = boards;
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

  openDeleteDialog(boardID?: number) {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: 'You are about to delete this board. This can’t be undone.',
        },
        panelClass: 'confirmation-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res === true) {
          const id = boardID ? boardID : this.menuBoard;
          this.sendMessage.emit(new BrainstormRemoveBoardEvent(id));
        }
      });
  }

  navigateToBoard(board: Board) {
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.sendMessage.emit(new ParticipantChangeBoardEvent(board.id));
      }
    });

    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.sendMessage.emit(new HostChangeBoardEvent(board.id));
      }
    });
  }

  isSet(boardType) {
    return isSet(boardType);
  }
}

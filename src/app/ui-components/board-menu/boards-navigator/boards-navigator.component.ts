import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { NgxPermissionsService } from 'ngx-permissions';
import { BrainstormEventService, BrainstormService, ContextService } from 'src/app';
import {
  Board,
  BoardSort,
  BoardStatus,
  BrainstormBoardSortOrderEvent,
  BrainstormChangeBoardStatusEvent,
  BrainstormClearBoardIdeaEvent,
  BrainstormRearrangeBoardEvent,
  BrainstormRemoveBoardEvent,
  BrainstormToggleParticipantNameEvent,
  Branding,
  DuplicateBoardEvent,
  EventTypes,
  HostChangeBoardEvent,
  ParticipantChangeBoardEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { BoardStatusService } from 'src/app/services/board-status.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.dialog';

@Component({
  selector: 'benji-boards-navigator',
  templateUrl: 'boards-navigator.component.html',
})
export class BoardsNavigatorComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  @Input() sidenav: MatSidenav;
  @Input() navType: string;
  @Output() sendMessage = new EventEmitter<any>();
  participants = [];

  board: Board;
  currentboardStatus: BoardStatus;
  selectedBoard: Board;
  boards: Array<Board> = [];

  hostname = window.location.host + '/participant/join?link=';
  boardsCount: number;
  menuBoard: any;
  hostBoard: number;

  showBottom = true;
  isParticipant = false;
  darkLogo: string;
  lessonName: string;
  lessonDescription: string;
  boardHovered = false;

  constructor(
    private dialog: MatDialog,
    private brainstormService: BrainstormService,
    private brainstormEventService: BrainstormEventService,
    private boardStatusService: BoardStatusService,
    private permissionsService: NgxPermissionsService,
    private utilsService: UtilsService,
    public contextService: ContextService
  ) {}

  ngOnInit(): void {
    this.brainstormService.selectedBoard$.subscribe((board: Board) => {
      if (board) {
        this.selectedBoardChanged(board);
      }
    });
    this.brainstormService.lessonName$.subscribe((lessonName: string) => {
      if (lessonName) {
        this.lessonName = lessonName;
      }
    });
    this.brainstormService.lessonDescription$.subscribe((lessonDescription: string) => {
      if (lessonDescription) {
        this.lessonDescription = lessonDescription;
      }
    });

    this.brainstormEventService.activityState$.subscribe((v: UpdateMessage) => {
      if (v) {
        this.activityState = v;
        this.hostBoard = this.activityState.brainstormactivity.host_board;
        this.initializeBoards();
      }
    });

    this.boardStatusService.boardStatus$.subscribe((status: BoardStatus) => {
      if (status) {
        this.currentboardStatus = status;
      }
    });

    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.isParticipant = true;
      }
    });

    if (!this.hostname.includes('localhost')) {
      this.hostname = 'https://' + this.hostname;
    }

    this.contextService.brandingInfo$.subscribe((info: Branding) => {
      if (info) {
        this.darkLogo = info.logo ? info.logo.toString() : '/assets/img/Benji_logo.svg';
      }
    });
  }

  selectedBoardChanged(board) {
    this.selectedBoard = board;
    this.currentboardStatus = board.status;
  }

  ngOnChanges(): void {
    if (
      this.activityState.eventType === 'BrainstormRemoveBoardEvent' ||
      this.activityState.eventType === 'BrainstormAddBoardEventBaseEvent'
    ) {
      this.resetBoards();
    }
    if (
      this.activityState.eventType === EventTypes.hostChangeBoardEvent ||
      this.activityState.eventType === EventTypes.participantChangeBoardEvent ||
      this.activityState.eventType === EventTypes.brainstormSubmitIdeaCommentEvent ||
      this.activityState.eventType === EventTypes.notificationEvent
    ) {
    } else {
      this.initializeBoards();
    }
  }

  initializeBoards() {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        const unSortedBoards: Array<Board> = this.getBoards();
        this.sortBoards(unSortedBoards);
      }
    });

    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        const unSortedBoards: Array<Board> = this.getBoards();
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

  getBoards() {
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

  getDragData(board: Board) {
    return { boardID: board.id };
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.boards, event.previousIndex, event.currentIndex);
    const draggedBoardID = event.item.data.boardID;
    let previous_board;
    let next_board;
    for (let i = 0; i < this.boards.length; i++) {
      const board = this.boards[i];
      if (board.id === draggedBoardID) {
        if (i === 0) {
          previous_board = null;
          if (this.boards[i + 1]) {
            next_board = this.boards[i + 1].id;
          } else {
            next_board = null;
          }
        } else if (i === this.boards.length - 1) {
          // last board
          next_board = null;
          if (this.boards[i - 1]) {
            previous_board = this.boards[i - 1].id;
          } else {
            previous_board = null;
          }
        } else {
          if (this.boards[i + 1]) {
            next_board = this.boards[i + 1].id;
            previous_board = this.boards[i - 1].id;
          }
        }
      }
    }

    this.sendMessage.emit(new BrainstormRearrangeBoardEvent(draggedBoardID, previous_board, next_board));
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

  duplicateBoard() {
    this.sendMessage.emit(new DuplicateBoardEvent(this.menuBoard));
  }

  setBoardStatus() {
    const selected = this.currentboardStatus;
    this.sendMessage.emit(
      new BrainstormChangeBoardStatusEvent(this.currentboardStatus, this.selectedBoard.id)
    );
  }

  toggleShowAuthorship() {
    this.sendMessage.emit(new BrainstormToggleParticipantNameEvent(this.selectedBoard.id));
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
}

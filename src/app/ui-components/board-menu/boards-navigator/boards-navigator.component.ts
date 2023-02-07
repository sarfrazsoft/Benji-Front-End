import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { cloneDeep } from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import { BrainstormEventService, BrainstormService, ContextService } from 'src/app';
import { getBoard } from 'src/app/services/activities/board-list-functions/get-board/get-board';
import { getFirstBoard } from 'src/app/services/activities/board-list-functions/get-first-board/get-first-board';
import { getLastBoard } from 'src/app/services/activities/board-list-functions/get-last-board/get-last-board';
import { movedBoard } from 'src/app/services/activities/board-list-functions/get-moved-board/get-moved-board';
import { moveBoard } from 'src/app/services/activities/board-list-functions/move-board/move-board';
import {
  Board,
  BoardSort,
  BoardStatus,
  BrainstormBoardSortOrderEvent,
  BrainstormRearrangeBoardEvent,
  BrainstormRemoveBoardEvent,
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

@UntilDestroy()
@Component({
  selector: 'benji-boards-navigator',
  templateUrl: 'boards-navigator.component.html',
})
export class BoardsNavigatorComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  @Input() sidenav: MatSidenav;
  @Input() navType: string;
  @Output() sendMessage = new EventEmitter<any>();
  @Output() toggleBoardsNavigator = new EventEmitter<any>();
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
  meetingMode = false;
  boardsNavHovered: boolean;
  closeBoardsNavHovered: boolean;

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

    this.brainstormService.meetingMode$.pipe(untilDestroyed(this)).subscribe((mode: boolean) => {
      this.meetingMode = mode;
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
        try {
          this.sortBoards(unSortedBoards);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  sortBoards(unSortedBoards: Array<Board>) {
    if (unSortedBoards.length === 0) {
      throw new Error('Input array is empty, cannot sort boards');
    }

    try {
      const firstBoard = getFirstBoard(unSortedBoards);

      const boards: Array<Board> = [firstBoard];
      const addedBoards = new Set();
      addedBoards.add(firstBoard);
      let nextId = firstBoard.next_board;
      while (nextId) {
        let found = false;
        for (let i = 0; i < unSortedBoards.length; i++) {
          const board = unSortedBoards[i];
          if (board.id === nextId && !addedBoards.has(board)) {
            boards.push(board);
            addedBoards.add(board);
            nextId = board.next_board;
            found = true;
            break;
          }
        }
        if (!found) {
          nextId = null;
        }
      }
      // adds remaining boards
      for (let i = 0; i < unSortedBoards.length; i++) {
        if (!boards.includes(unSortedBoards[i])) {
          boards.push(unSortedBoards[i]);
        }
      }
      this.boards = boards;
    } catch (error) {
      console.error(error);
    }
  }

  handleOrphanBoard(board: Board) {
    // your separate function code here
    // console.log(`Orphan board found: ${board.id}`);
    throw new Error(`Orphan board found: ${board.id}`);
    // this.sendMessage.emit(new BrainstormRearrangeBoardEvent(board.id, null, board.next_board));
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
    const draggedBoardID = event.item.data.boardID;
    const draggedBoard = getBoard(draggedBoardID, this.boards);
    const moved = movedBoard(cloneDeep(this.boards), event.previousIndex, event.currentIndex);
    moveBoard(moved, this.boards);

    this.sendMessage.emit(
      new BrainstormRearrangeBoardEvent(draggedBoardID, moved.previous_board, moved.next_board)
    );
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
    if (!this.meetingMode) {
      this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
        if (val) {
          this.sendMessage.emit(new ParticipantChangeBoardEvent(board.id));
        }
      });
    }

    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.sendMessage.emit(new HostChangeBoardEvent(board.id));
      }
    });
  }

  duplicateBoard() {
    this.sendMessage.emit(new DuplicateBoardEvent(this.menuBoard));
  }

  resetBoards() {
    this.boardsCount = 0;
    this.boards = this.boards.filter((board) => board.removed === false);
    this.boardsCount = this.boards.length;
  }

  setMenuBoard(board: Board) {
    this.menuBoard = board.id;
  }

  changeOrder(order: { value: BoardSort; name: string }) {
    this.sendMessage.emit(new BrainstormBoardSortOrderEvent(order.value, this.selectedBoard.id));
  }
}

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
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.dialog';

@Component({
  selector: 'benji-board-menu',
  templateUrl: 'board-menu.component.html',
})
export class BoardMenuComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  @Input() sidenav: MatSidenav;
  @Input() navType: string;
  // editingInstructions: boolean;
  @ViewChild('title') InstructionsElement: ElementRef;
  // editingSubInstructions: boolean;
  @ViewChild('instructions') SubInstructionsElement: ElementRef;
  @Output() sendMessage = new EventEmitter<any>();
  title_instructions = '';
  sub_instructions = '';
  tempTitle = "";
  tempInstructions = "";
  statusDropdown = ['Open', 'View Only', 'Closed'];
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
  ];
  defaultSort = 'newest_to_oldest';
  participants = [];

  meetingMode: boolean;
  showAuthorship: boolean;
  board: Board;
  boardMode: string;
  gridMode: boolean;
  threadMode: boolean;
  columnsMode: boolean;
  boardStatus: string;
  selectedBoard: Board;
  boards: Array<Board> = [];

  hostname = window.location.host + '/participant/join?link=';
  boardsCount: number;
  menuBoard: any;
  hostBoard: number;

  showBottom = true;
  dragDisabled = false;
  private typingTimer;

  constructor(
    private dialog: MatDialog,
    private brainstormService: BrainstormService,
    private permissionsService: NgxPermissionsService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.brainstormService.selectedBoard$.subscribe((board: Board) => {
      if (board) {
        this.selectedBoardChanged(board);
      }
    });

    this.getBoardInstructions();

    this.meetingMode = this.activityState.brainstormactivity.meeting_mode;
    this.initializeBoards();
    this.hostBoard = this.activityState.brainstormactivity.host_board;

    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.dragDisabled = true;
      }
    });

    if (!this.hostname.includes('localhost')) {
      this.hostname = 'https://' + this.hostname;
    }
  }

  getBoardInstructions() {
    this.brainstormService.boardTitle$.subscribe((title: string) => {
      if (title) {
        this.title_instructions = title;
      }
    });
    this.brainstormService.boardInstructions$.subscribe((instructions: string) => {
      if (instructions) {
        this.sub_instructions = instructions;
      }
    });
  }

  selectedBoardChanged(board) {
    this.selectedBoard = board;
    this.boardMode = this.selectedBoard.board_activity.mode;
    this.decideBoardMode(this.boardMode);
    this.showAuthorship = this.selectedBoard.board_activity.show_participant_name_flag;
    //this.getBoardInstructions();
    this.boardStatus =
      board.status === 'open' ? 'Open' : board.status === 'view_only' ? 'View Only' : 'Closed';
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
    } 
    // if (
    //   this.activityState.eventType === 'BrainstormEditBoardInstruction' ||
    //   this.activityState.eventType === 'BrainstormEditSubInstruction'
    // ) {
    //   this.getBoardInstructions();
    // }
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
    const unSortedBoards: Array<Board> = this.activityState.brainstormactivity.boards.filter(
      (board) => board.removed === false
    );
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

  addBoard(previousBoard: Board) {
    this.sendMessage.emit(
      new BrainstormAddBoardEventBaseEvent(
        'Board ' + this.boards.length,
        previousBoard.id,
        previousBoard.next_board,
        'Untitled Board ' + this.boards.length,
        'Sub Instructions'
      )
    );
  }

  typingStoped(type: string) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.doneTyping(type);
    }, 500);
  }

  // on keydown, clear the countdown
  typingStarted() {
    clearTimeout(this.typingTimer);
  }

  doneTyping(type: string) {
    if (type === 'title') {
      this.sendMessage.emit(new BrainstormEditInstructionEvent(this.InstructionsElement.nativeElement.value, this.selectedBoard.id));
    } else if (type === 'instructions') {
      this.sendMessage.emit(new BrainstormEditSubInstructionEvent(this.SubInstructionsElement.nativeElement.value, this.selectedBoard.id));
    }
  }

  getInitials(nameString: string) {
    const fullName = nameString.split(' ');
    const first = fullName[0] ? fullName[0].charAt(0) : '';
    const second = fullName[1] ? fullName[1].charAt(0) : '';
    return (first + second).toUpperCase();
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

  setBoardMode(mode: string) {
    this.sendMessage.emit(new BrainstormChangeModeEvent(mode, this.selectedBoard.id));
    this.decideBoardMode(mode);
  }

  decideBoardMode(mode: string) {
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
    const selected = this.boardStatus;
    const status = selected === 'Open' ? 'open' : selected === 'View Only' ? 'view_only' : 'closed';
    this.sendMessage.emit(new BrainstormChangeBoardStatusEvent(status, this.selectedBoard.id));
  }

  toggleMeetingMode($event) {
    this.sendMessage.emit(new BrainstormToggleMeetingMode($event.currentTarget.checked));
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

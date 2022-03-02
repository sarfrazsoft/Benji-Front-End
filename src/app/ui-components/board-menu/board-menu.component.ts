import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { NgxPermissionsService } from 'ngx-permissions';
import { BrainstormService } from 'src/app';
import {
  Board,
  BrainstormAddBoardEventBaseEvent,
  BrainstormBoardSortOrderEvent,
  BrainstormChangeBoardStatusEvent,
  BrainstormChangeModeEvent,
  BrainstormClearBoardIdeaEvent,
  BrainstormEditInstructionEvent,
  BrainstormEditSubInstructionEvent,
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
export class BoardMenuComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() activityState: UpdateMessage;
  @Input() sidenav: MatSidenav;
  @Input() navType: string;
  // editingInstructions: boolean;
  @ViewChild('title') InstructionsElement: ElementRef;
  // editingSubInstructions: boolean;
  @ViewChild('instructions') SubInstructionsElement: ElementRef;
  @Output() sendMessage = new EventEmitter<any>();
  instructions = '';
  sub_instructions = '';
  statusDropdown = ['Open', 'View Only', 'Closed'];
  postOrderDropdown = [
    {
      value: 'newest_to_oldest',
      name: 'Newest to oldest',
    },
    {
      value: 'oldest_to_newest',
      name: 'Oldest to newest',
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

  constructor(
    private dialog: MatDialog,
    private brainstormService: BrainstormService,
    private permissionsService: NgxPermissionsService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.brainstormService.selectedBoard$.subscribe((board: Board) => {
      if (board) {
        this.selectedBoard = board;
        this.boardMode = this.selectedBoard.board_activity.mode;
        this.showAuthorship = this.selectedBoard.board_activity.show_participant_name_flag;
        this.instructions = board.board_activity.instructions;
        this.sub_instructions = board.board_activity.sub_instructions;
        this.boardStatus =
          board.status === 'open' ? 'Open' : board.status === 'view_only' ? 'View Only' : 'Closed';
        if (board.sort) {
          this.defaultSort = board.sort;
        }
      }
    });

    this.meetingMode = this.activityState.brainstormactivity.meeting_mode;
    this.initializeBoards();
    this.hostBoard = this.activityState.brainstormactivity.host_board;
  }

  ngOnChanges(): void {
    if (
      this.activityState.eventType === 'BrainstormRemoveBoardEvent' ||
      this.activityState.eventType === 'BrainstormAddBoardEventBaseEvent'
    ) {
      this.resetBoards();
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

  ngAfterViewInit(): void {
      this.decideBoardMode(this.boardMode);
  }

  initializeBoards() {
    const boards = this.activityState.brainstormactivity.boards.filter((board) => board.removed === false);
    this.boards = boards.sort((a, b) => a.order - b.order);
  }

  getBoardParticipantCodes(board: Board) {
    return this.activityState.brainstormactivity.participants[board.id];
  }

  closeNav() {
    this.sidenav.close();
  }

  addBoard(boardIndex: number) {
    this.sendMessage.emit(
      new BrainstormAddBoardEventBaseEvent(
        'Board ' + this.boards.length,
        boardIndex + 1,
        'Untitled Board ' + this.boards.length,
        'Sub Instructions'
      )
    );
  }

  editInstructions() {
    setTimeout(() => {
      this.InstructionsElement.nativeElement.focus();
    }, 0);
  }

  saveEditedInstructions() {
    this.sendMessage.emit(new BrainstormEditInstructionEvent(this.instructions, this.selectedBoard.id));
  }

  editSubInstructions() {
    setTimeout(() => {
      this.SubInstructionsElement.nativeElement.focus();
    }, 0);
  }

  saveEditedSubInstructions() {
    this.sendMessage.emit(
      new BrainstormEditSubInstructionEvent(this.sub_instructions, this.selectedBoard.id)
    );
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
        panelClass: 'delete-board-dialog',
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
    console.log(mode);
    switch(mode) {
      case "grid":
        this.gridMode = true;
        this.threadMode = false;
        this.columnsMode = false;
        break;
      case "thread":
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
        panelClass: 'clear-board-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.sendMessage.emit(new BrainstormClearBoardIdeaEvent(this.selectedBoard.id));
        }
      });
  }

  changeOrder(order) {
    this.sendMessage.emit(new BrainstormBoardSortOrderEvent(order.value, this.selectedBoard.id));
  }
}

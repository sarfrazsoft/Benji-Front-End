import {
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
  BrainstormChangeBoardStatusEvent,
  BrainstormChangeModeEvent,
  BrainstormEditInstructionEvent,
  BrainstormEditSubInstructionEvent,
  BrainstormRemoveBoardEvent,
  BrainstormToggleMeetingMode,
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
  editingInstructions: boolean;
  @ViewChild('title') InstructionsElement: ElementRef;
  editingSubInstructions: boolean;
  @ViewChild('instructions') SubInstructionsElement: ElementRef;
  @Output() sendMessage = new EventEmitter<any>();
  instructions = '';
  sub_instructions = '';
  statusDropdown = ['Open', 'View Only', 'Closed'];
  participants = [];

  board: Board;
  boardMode: string;
  boardStatus: string;
  selectedBoard: Board;
  boards: Array<Board> = [];
  participantCodes: number[];

  hostname = window.location.host + '/participant/join?link=';
  boardsCount: number;
  menuBoard: any;

  constructor(
    private dialog: MatDialog,
    private brainstormService: BrainstormService,
    private permissionsService: NgxPermissionsService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    // if (this.activityState && this.activityState.brainstormactivity) {
    //   this.instructions = this.activityState.brainstormactivity.instructions;
    //   this.sub_instructions = this.activityState.brainstormactivity.sub_instructions;
    // }

    // this.resetBoards();
    // this.boardsCount = this.boards.length;

    this.brainstormService.selectedBoard$.subscribe((board: Board) => {
      if (board) {
        this.selectedBoard = board;
        this.boardMode = this.selectedBoard.board_activity.mode;
        this.instructions = board.board_activity.instructions;
        this.sub_instructions = board.board_activity.sub_instructions;
        this.boardStatus =
          board.status === 'open' ? 'Open' : board.status === 'view_only' ? 'View Only' : 'Closed';
      }
    });

    // const boards = this.activityState.brainstormactivity.boards.filter((board) => board.removed === false);
    // this.boards = boards.sort((a, b) => b.order - a.order);
  }

  ngOnChanges(): void {
    if (this.activityState.eventType === 'BrainstormRemoveBoardEvent') {
      this.resetBoards();
    }
    if (this.selectedBoard) {
      this.participantCodes = this.activityState.brainstormactivity.participants[this.selectedBoard.id];
    }

    if (this.navType === 'boards') {
      if (this.activityState.eventType === 'HostChangeBoardEvent') {
      } else {
        const boards = this.activityState.brainstormactivity.boards.filter(
          (board) => board.removed === false
        );
        this.boards = boards.sort((a, b) => a.order - b.order);
      }
    }
  }

  diplayInfo() {
    console.log(this.activityState);
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
    this.editingInstructions = true;
    setTimeout(() => {
      this.InstructionsElement.nativeElement.focus();
    }, 0);
  }

  saveEditedInstructions() {
    this.editingInstructions = false;
    this.sendMessage.emit(new BrainstormEditInstructionEvent(this.instructions, this.selectedBoard.id));
  }

  editSubInstructions() {
    this.editingSubInstructions = true;
    setTimeout(() => {
      this.SubInstructionsElement.nativeElement.focus();
    }, 0);
  }

  saveEditedSubInstructions() {
    this.editingSubInstructions = false;
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

  openDeleteDialog() {
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
          this.sendMessage.emit(new BrainstormRemoveBoardEvent(this.menuBoard));
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
    this.boardMode = mode;
    this.sendMessage.emit(new BrainstormChangeModeEvent(this.boardMode, this.selectedBoard.id));
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
}

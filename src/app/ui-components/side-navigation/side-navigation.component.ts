import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { BrainstormService } from 'src/app';
import {
  Board,
  BrainstormEditInstructionEvent,
  BrainstormEditSubInstructionEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { DeleteBoardDialogComponent } from 'src/app/shared/dialogs/delete-board-dialog/delete-board.dialog';

@Component({
  selector: 'side-navigation',
  templateUrl: 'side-navigation.component.html',
})
export class SideNavigationComponent implements OnInit {
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
  statusDropdown = ['Active', 'View Only', 'Hidden'];
  participants = ['Me Pi', 'Alex Mat', 'Lee Nim', 'Sam M'];

  board: Board;
  boardMode: string;

  constructor(private dialog: MatDialog, private brainstormService: BrainstormService) {}

  ngOnInit(): void {
    // if (this.activityState && this.activityState.brainstormactivity) {
    //   this.instructions = this.activityState.brainstormactivity.instructions;
    //   this.sub_instructions = this.activityState.brainstormactivity.sub_instructions;
    // }

    this.brainstormService.selectedBoard$.subscribe((board: Board) => {
      if (board) {
        this.board = board;
        this.instructions = board.board_activity.instructions;
        this.sub_instructions = board.board_activity.sub_instructions;
      }
    });
  }

  diplayInfo() {
    console.log(this.activityState);
  }

  closeNav() {
    this.sidenav.close();
  }

  editInstructions() {
    this.editingInstructions = true;
    setTimeout(() => {
      this.InstructionsElement.nativeElement.focus();
    }, 0);
  }

  saveEditedInstructions() {
    this.editingInstructions = false;
    this.sendMessage.emit(new BrainstormEditInstructionEvent(this.instructions, this.board.id));
  }

  editSubInstructions() {
    this.editingSubInstructions = true;
    setTimeout(() => {
      this.SubInstructionsElement.nativeElement.focus();
    }, 0);
  }

  saveEditedSubInstructions() {
    this.editingSubInstructions = false;
    this.sendMessage.emit(new BrainstormEditSubInstructionEvent(this.sub_instructions, this.board.id));
  }

  getInitials(nameString: string) {
    const fullName = nameString.split(' ');
    const first = fullName[0] ? fullName[0].charAt(0) : '';
    const second = fullName[1] ? fullName[1].charAt(0) : '';
    return (first + second).toUpperCase();
  }

  openDeleteDialog() {
    this.dialog
      .open(DeleteBoardDialogComponent, {
        panelClass: 'delete-board-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        console.log(res);
      });
  }

  setBoardMode(mode: string) {
    this.boardMode = mode;
  }
}

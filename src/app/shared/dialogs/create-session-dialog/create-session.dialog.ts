import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'benji-create-session-dialog',
  templateUrl: 'create-session.dialog.html'
})
export class CreateSessionDialogComponent implements OnInit {

  roomCode;
  title = "Give your session a name";
  description = "This is where the instructions go...";
  editingTitle: boolean;
  editingDescription: boolean;
  @ViewChild('title') TitleElement: ElementRef;
  @ViewChild('description') DescriptionElement: ElementRef;

  constructor(
    private dialogRef: MatDialogRef<CreateSessionDialogComponent>,
    private router: Router
  ) {}

  ngOnInit() {}

  public selectDefault() {
    this.dialogRef.close({});
  }

  public cancel() {
    this.dialogRef.close();
  }
  
  editTitle() {
    this.editingTitle = true;
    setTimeout(() => {
      this.TitleElement.nativeElement.focus();
    }, 0);
  }

  saveEditedTitle() {
    this.editingTitle = false;
    //this.sendMessage.emit(new BrainstormEditInstructionEvent(this.instructions));
  }
  
  editDescription() {
    this.editingDescription = true;
    setTimeout(() => {
      this.DescriptionElement.nativeElement.focus();
    }, 0);
  }

  saveEditedDescription() {
    this.editingDescription = false;
    //this.sendMessage.emit(new BrainstormEditSubInstructionEvent(this.sub_instructions));
  }

}

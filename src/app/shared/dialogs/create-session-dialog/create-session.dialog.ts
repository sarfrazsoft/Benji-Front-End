import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'benji-create-session-dialog',
  templateUrl: 'create-session.dialog.html'
})
export class CreateSessionDialogComponent implements OnInit {

  roomCode;
  placeholderTitle = "Give your session a name";
  placeholderDescription = "This is where the instructions go...";
  sessionTitle = "";
  sessionDescription = "";
  editingTitle: boolean;
  editingDescription: boolean;
  @ViewChild('title') TitleElement: ElementRef;
  @ViewChild('description') DescriptionElement: ElementRef;

  constructor(
    private dialogRef: MatDialogRef<CreateSessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      description: string;
    },
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

  onSubmit() {
    this.dialogRef.close({
      title: this.sessionTitle,
      description: this.sessionDescription
    });
  }

}

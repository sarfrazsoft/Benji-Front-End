import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'benji-session-summary-dialog',
  templateUrl: 'session-summary.dialog.html'
})
export class SessionSummaryDialogComponent implements OnInit {

  roomCode;
  placeholderTitle = "Give your session a name";
  placeholderDescription = "This is where the instructions go...";
  sessionTitle = "";
  sessionDescription = "";
  editingTitle: boolean = true;
  editingDescription: boolean;
  @ViewChild('title') TitleElement: ElementRef;
  @ViewChild('description') DescriptionElement: ElementRef;

  constructor(
    private dialogRef: MatDialogRef<SessionSummaryDialogComponent>,
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
  }
  
  editDescription() {
    this.editingDescription = true;
    setTimeout(() => {
      this.DescriptionElement.nativeElement.focus();
    }, 0);
  }

  saveEditedDescription() {
    this.editingDescription = false;
  }

  onSubmit() {
    this.dialogRef.close({
      title: this.sessionTitle,
      description: this.sessionDescription
    });
  }

}

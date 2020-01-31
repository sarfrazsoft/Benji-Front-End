import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { fromEvent, Observable, Subject } from 'rxjs';

@Component({
  selector: 'benji-add-learners-dialog',
  templateUrl: 'add-learners.dialog.html'
})
export class AddLearnersDialogComponent implements OnInit {
  public confirmationMessage: string;
  eventsSubject: Subject<void> = new Subject<void>();
  constructor(
    private dialogRef: MatDialogRef<AddLearnersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.confirmationMessage = data.confirmationMessage;
  }
  selectedSession;

  ngOnInit() {}

  deleteCourse() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  addToGroup() {
    this.eventsSubject.next();
  }
}

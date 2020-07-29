import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'benji-error-message-dialog',
  templateUrl: 'error-message.dialog.html'
})
export class ErrorMessageDialogComponent implements OnInit {
  public errorMessage: string;
  constructor(
    private dialogRef: MatDialogRef<ErrorMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.errorMessage = data.errorMessage;
  }
  selectedSession;

  ngOnInit() {}

  // deleteCourse() {
  //   this.dialogRef.close(true);
  // }

  // cancel() {
  //   this.dialogRef.close(false);
  // }
}

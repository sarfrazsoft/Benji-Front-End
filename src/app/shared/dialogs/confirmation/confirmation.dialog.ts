import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'benji-confirmation-dialog',
  templateUrl: 'confirmation.dialog.html',
})
export class ConfirmationDialogComponent implements OnInit {
  public confirmationMessage: string;
  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.confirmationMessage = data.confirmationMessage;
  }
  selectedSession;

  ngOnInit() {}

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}

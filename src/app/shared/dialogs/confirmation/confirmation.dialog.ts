import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  confirmationTitle?: string;
  confirmationMessage?: string;
  actionButton?: string;
  cancelButton?: string;
}

@Component({
  selector: 'benji-confirmation-dialog',
  templateUrl: 'confirmation.dialog.html',
})
export class ConfirmationDialogComponent implements OnInit {
  public confirmationTitle: string;
  public confirmationMessage: string;
  public actionButton: string;
  public actionButton: string;
  public cancelButton2: string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {
    this.confirmationTitle = data.confirmationTitle;
    this.confirmationMessage = data.confirmationMessage;
    this.actionButton = data.actionButton;
    this.cancelButton = data.cancelButton;
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

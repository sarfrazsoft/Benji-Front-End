import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DuplicateSessionDialogData {
  confirmationTitle?: string;
  confirmationMessage?: string;
  actionButton?: string;
  cancelButton?: string;
}

@Component({
  selector: 'benji-duplicate-session-dialog',
  templateUrl: 'duplicate-session.dialog.html',
})
export class DuplicateSessionDialogComponent implements OnInit {
  public confirmationTitle: string;
  public confirmationMessage: string;
  public actionButton: string;
  public cancelButton: string;
  copyBoards = false;
  copyBoardsPosts = false;
  constructor(
    private dialogRef: MatDialogRef<DuplicateSessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DuplicateSessionDialogData
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

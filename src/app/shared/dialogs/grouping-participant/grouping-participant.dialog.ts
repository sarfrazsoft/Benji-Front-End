import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'benji-grouping-participant-dialog',
  templateUrl: 'grouping-participant.dialog.html',
})
export class GroupingParticipantDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<GroupingParticipantDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private matDialog: MatDialog
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}

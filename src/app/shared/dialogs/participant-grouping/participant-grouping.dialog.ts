import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'benji-participant-grouping-dialog',
  templateUrl: 'participant-grouping.dialog.html',
})
export class ParticipantGroupingDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ParticipantGroupingDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private matDialog: MatDialog
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}

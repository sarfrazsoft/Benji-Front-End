import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllowParticipantGroupingMidActivityEvent } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-participant-grouping-dialog',
  templateUrl: 'participant-grouping.dialog.html',
})
export class ParticipantGroupingDialogComponent {
  @Output() sendMessage = new EventEmitter<any>();
  constructor(
    private dialogRef: MatDialogRef<ParticipantGroupingDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private matDialog: MatDialog
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  toggleMidActChooseGroup($event) {
    this.sendMessage.emit(new AllowParticipantGroupingMidActivityEvent($event.currentTarget.checked));
  }
}

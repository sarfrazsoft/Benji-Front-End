import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivityTypes } from 'src/app/globals';

@Component({
  selector: 'benji-peak-back-dialog',
  templateUrl: 'peak-back.dialog.html',
})
export class PeakBackDialogComponent {
  roomCode;
  serverMessage;
  at: typeof ActivityTypes = ActivityTypes;
  instructions = 'private dialogRef: MatDialogRef<PeakBackDialogComponent>';

  constructor(
    private dialogRef: MatDialogRef<PeakBackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.serverMessage = data.serverMessage;
  }
  getActivityType() {
    if (this.serverMessage.activity_type !== null) {
      return this.serverMessage.activity_type;
    } else {
      return null;
    }
  }
}

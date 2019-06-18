import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'benji-low-response-dialog',
  templateUrl: 'low-response.dialog.html'
})
export class LowResponseDialogComponent {
  roomCode;
  timeObj;

  constructor(
    private dialogRef: MatDialogRef<LowResponseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.timeObj = data.timer;
  }
}

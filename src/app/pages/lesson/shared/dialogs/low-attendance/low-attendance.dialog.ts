import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'benji-low-attendance-dialog',
  templateUrl: 'low-attendance.dialog.html'
})
export class LowAttendanceDialogComponent {
  roomCode;
  timeObj;

  constructor(
    private dialogRef: MatDialogRef<LowAttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.timeObj = data.timer;
  }
}

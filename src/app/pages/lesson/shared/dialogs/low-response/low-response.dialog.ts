import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'benji-low-response-dialog',
  templateUrl: 'low-response.dialog.html'
})
export class LowResponseDialogComponent implements OnInit {
  roomCode;
  timeObj;
  @ViewChild('timer') timer;

  constructor(
    private dialogRef: MatDialogRef<LowResponseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.timeObj = data.timer;
  }

  ngOnInit() {
    this.timer.startTimer(0);
    const seconds = (Date.parse(this.timeObj.end_time) - Date.now()) / 1000;
    this.timer.startTimer(seconds);
  }
}

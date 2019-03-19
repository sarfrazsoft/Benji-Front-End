import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'benji-low-response-dialog',
  templateUrl: 'low-response.dialog.html'
})
export class LowResponseDialogComponent implements OnInit {
  roomCode;
  constructor(private dialogRef: MatDialogRef<LowResponseDialogComponent>) {}
  @ViewChild('timer') timer;
  ngOnInit() {
    // const seconds = (Date.parse(endTime) - Date.now()) / 1000;

    const seconds = 200;
    this.timer.startTimer(seconds);
  }
}

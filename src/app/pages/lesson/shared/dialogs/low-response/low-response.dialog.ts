import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'benji-low-response-dialog',
  templateUrl: 'low-response.dialog.html'
})
export class LowResponseDialogComponent implements OnInit {
  roomCode;
  constructor(private dialogRef: MatDialogRef<LowResponseDialogComponent>) {}

  ngOnInit() {}
}

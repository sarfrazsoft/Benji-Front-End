import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'benji-join-session-dialog',
  templateUrl: 'join-session.dialog.html'
})
export class JoinSessionDialogComponent implements OnInit {
  roomCode;
  constructor(private dialogRef: MatDialogRef<JoinSessionDialogComponent>) {}

  ngOnInit() {}

  public selectDefault() {
    this.dialogRef.close({});
  }

  public select(course: any): void {
    this.dialogRef.close(course);
  }
}

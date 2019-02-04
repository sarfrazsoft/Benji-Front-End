import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'benji-launch-session-dialog',
  templateUrl: 'launch-session.dialog.html'
})
export class LaunchSessionDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<LaunchSessionDialogComponent>) {}

  ngOnInit() {}

  public selectDefault() {
    this.dialogRef.close({});
  }

  public select(course: any): void {
    this.dialogRef.close(course);
  }
}

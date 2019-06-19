import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'benji-join-session-dialog',
  templateUrl: 'join-session.dialog.html'
})
export class JoinSessionDialogComponent implements OnInit {
  roomCode;
  constructor(
    private dialogRef: MatDialogRef<JoinSessionDialogComponent>,
    private router: Router
  ) {}

  ngOnInit() {}

  public selectDefault() {
    this.dialogRef.close({});
  }

  public select(course: any): void {
    this.dialogRef.close(course);
  }

  joinSession() {
    this.dialogRef.close({});
    this.router.navigate(['/participant/join']);
  }
}

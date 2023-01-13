import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'benji-pro-plan-dialog',
  templateUrl: 'pro-plan.dialog.html',
})
export class ProPlanDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<ProPlanDialogComponent>) {}

  ngOnInit() {}

  confirm() {
    this.dialogRef.close(true);
  }
}

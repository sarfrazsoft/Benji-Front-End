import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ContextService } from 'src/app/services';

@Component({
  selector: 'benji-job-info-dialog',
  templateUrl: 'job-info.dialog.html'
})
export class JobInfoDialogComponent implements OnInit {
  jobTitle;
  name;
  affiliation;
  courses = [{ id: 1, name: 'Sales' }, { id: 12, name: 'Accounting' }];

  constructor(
    private dialogRef: MatDialogRef<JobInfoDialogComponent>,
    private contextService: ContextService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.name = data.name;
  }

  ngOnInit() {}

  public selectDefault() {
    this.dialogRef.close({});
  }

  public select(course: any): void {
    console.log('boom');
    this.dialogRef.close(course);
  }

  submit() {
    if (this.jobTitle && this.affiliation) {
      this.dialogRef.close({
        job: this.jobTitle,
        affiliation: this.affiliation
      });
    }
  }
}

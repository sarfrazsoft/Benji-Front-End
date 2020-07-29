import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AdminService } from 'src/app/dashboard';
import * as global from 'src/app/globals';
import { BackendRestService, ContextService } from 'src/app/services';

@Component({
  selector: 'benji-mcq-feedback-dialog',
  templateUrl: 'mcq-feedback.dialog.html'
})
export class MCQFeedbackDialogComponent implements OnInit {
  public explanationMessage: string;
  constructor(
    private dialogRef: MatDialogRef<MCQFeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.explanationMessage = data.explanationMessage;
  }

  ngOnInit() {}

  closeDialog() {
    this.dialogRef.close({});
  }
}

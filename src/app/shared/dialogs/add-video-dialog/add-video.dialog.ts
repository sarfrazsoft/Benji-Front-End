import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fromEvent, Observable, Subject } from 'rxjs';

@Component({
  selector: 'benji-add-video-dialog',
  templateUrl: 'add-video.dialog.html',
})
export class AddVideoDialogComponent implements OnInit {
  // public confirmationMessage: string;
  form: FormGroup;
  emailErr = false;
  emailErrMsg = '';
  invitationsSent = false;
  userId: number;
  orgId: number;
  url: string;
  eventsSubject: Subject<void> = new Subject<void>();
  constructor(
    private dialogRef: MatDialogRef<AddVideoDialogComponent>,
    private builder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.userId = data.userId;
  }
  selectedSession;

  ngOnInit() {
    // this.form = this.builder.group({
    //   emails: new FormControl('', [Validators.required]),
    // });
  }

  get emails(): AbstractControl {
    return this.form.get('emails');
  }

  emailChanged() {
    this.emailErr = false;
    this.emailErrMsg = '';
  }

  onSubmit(): void {
    this.dialogRef.close({
      url: this.url,
    });
  }
}

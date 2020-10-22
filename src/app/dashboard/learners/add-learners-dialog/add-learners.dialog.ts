import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fromEvent, Observable, Subject } from 'rxjs';
import { LearnerService } from '../services/learner.service';

@Component({
  selector: 'benji-add-learners-dialog',
  templateUrl: 'add-learners.dialog.html',
})
export class AddLearnersDialogComponent implements OnInit {
  // public confirmationMessage: string;
  form: FormGroup;
  emailErr = false;
  emailErrMsg = '';
  invitationsSent = false;
  userId: number;
  orgId: number;
  eventsSubject: Subject<void> = new Subject<void>();
  constructor(
    private dialogRef: MatDialogRef<AddLearnersDialogComponent>,
    private builder: FormBuilder,
    private learnerService: LearnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userId = data.userId;
  }
  selectedSession;

  ngOnInit() {
    this.form = this.builder.group({
      emails: new FormControl('', [Validators.required]),
    });
  }

  get emails(): AbstractControl {
    return this.form.get('emails');
  }

  emailChanged() {
    this.emailErr = false;
    this.emailErrMsg = '';
  }

  onSubmit(): void {
    if (this.form.valid) {
      const emails = this.form.value.emails.split(',');
      if (emails.length === 1) {
        const data = {
          email: emails[0].trim(),
          inviter: this.userId,
        };
        this.learnerService.addLearner(data).subscribe(
          (res) => {
            this.form.reset();
            this.invitationsSent = true;
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        const json = [];
        emails.forEach((email) => {
          json.push({
            email: email.trim(),
            inviter: this.userId,
          });
        });
        this.learnerService.addLearners(json).subscribe(
          (res) => {
            this.form.reset();
            this.invitationsSent = true;
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }
  }
}

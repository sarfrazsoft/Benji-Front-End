import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fromEvent, Observable, Subject } from 'rxjs';
// import { LearnerService } from '../services/learner.service';

@Component({
  selector: 'benji-case-study-checkin-dialog',
  templateUrl: 'case-study-checkin.dialog.html',
})
export class CaseStudyCheckinDialogComponent implements OnInit {
  // public confirmationMessage: string;
  form: FormGroup;
  emailErr = false;
  emailErrMsg = '';
  invitationsSent = false;
  userId: number;
  orgId: number;
  breakoutRooms = [
    { question: 'Ready to move on?', id: 1 },
    { question: 'Need help?', id: 3 },
    { question: 'How much time do you need?', id: 2 },
  ];
  eventsSubject: Subject<void> = new Subject<void>();
  constructor(
    private dialogRef: MatDialogRef<CaseStudyCheckinDialogComponent>,
    private builder: FormBuilder,
    // private learnerService: any,
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
        // this.learnerService.addLearner(data).subscribe(
        //   (res) => {
        //     this.form.reset();
        //     this.invitationsSent = true;
        //   },
        //   (err) => {
        //     console.log(err);
        //   }
        // );
      } else {
        const json = [];
        emails.forEach((email) => {
          json.push({
            email: email.trim(),
            inviter: this.userId,
          });
        });
        // this.learnerService.addLearners(json).subscribe(
        //   (res) => {
        //     this.form.reset();
        //     this.invitationsSent = true;
        //   },
        //   (err) => {
        //     console.log(err);
        //   }
        // );
      }
    }
  }
}

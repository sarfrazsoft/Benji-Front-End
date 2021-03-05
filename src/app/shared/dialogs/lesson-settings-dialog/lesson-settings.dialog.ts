import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fromEvent, Observable, Subject } from 'rxjs';

@Component({
  selector: 'benji-lesson-settings-dialog',
  templateUrl: 'lesson-settings.dialog.html',
})
export class LessonSettingsDialogComponent implements OnInit {
  // public confirmationMessage: string;
  form: FormGroup;
  emailErr = false;
  emailErrMsg = '';
  invitationsSent = false;
  userId: number;
  orgId: number;
  eventsSubject: Subject<void> = new Subject<void>();
  constructor(
    private dialogRef: MatDialogRef<LessonSettingsDialogComponent>,
    private builder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userId = data.userId;
  }
  selectedSession;

  ngOnInit() {
    this.form = this.builder.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  emailChanged() {
    this.emailErr = false;
    this.emailErrMsg = '';
  }

  onSubmit(): void {
    if (this.form.valid) {
      const emails = this.form.value.emails.split(',');
      const json = [];
      emails.forEach((email) => {
        json.push({
          email: email.trim(),
          inviter: this.userId,
        });
      });
      // this.groupServices.addLearners(json).subscribe(
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

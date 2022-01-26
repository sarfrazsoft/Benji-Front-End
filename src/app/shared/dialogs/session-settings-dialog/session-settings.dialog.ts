import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { Lesson } from 'src/app/services/backend/schema/course_details';
@Component({
  selector: 'benji-session-settings-dialog',
  templateUrl: 'session-settings.dialog.html',
})
export class SessionSettingsDialogComponent implements OnInit {
  form: FormGroup;
  emailErr = false;
  emailErrMsg = '';
  invitationsSent = false;
  userId: number;
  orgId: number;
  eventsSubject: Subject<void> = new Subject<void>();
  focusTitle;
  focusDescription;
  createSession: boolean;
  constructor(
    private httpClient: HttpClient,
    private dialogRef: MatDialogRef<SessionSettingsDialogComponent>,
    private builder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  selectedSession;

  ngOnInit() {
    this.form = this.builder.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
    this.form.setValue({ title: this.data.title, description: this.data.description });
    this.createSession = this.data.createSession;
  }

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  updateLesson(lesson: Lesson, id): Observable<any[]> {
    return this.httpClient.patch<any[]>(global.apiRoot + `/course_details/lesson/${id}/`, lesson);
  }

  onSubmit(): void {
    if (this.createSession && this.form.valid) {
      const val = this.form.value;
      this.dialogRef.close({
        title: val.title,
        description: val.description,
      });
    } else if (this.form.valid) {
      const val = this.form.value;
      const l: Lesson = {
        lesson_name: val.title,
        lesson_description: val.description,
      };
      this.updateLesson(l, this.data.id)
        .pipe(
          map((res) => res),
          catchError((error) => error)
        )
        .subscribe((res: Lesson) => {
          this.dialogRef.close(l);
        });
    }
  }
}

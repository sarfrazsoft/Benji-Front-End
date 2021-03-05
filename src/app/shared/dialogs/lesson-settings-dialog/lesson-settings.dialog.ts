import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fromEvent, Observable, Subject } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { EditorService } from 'src/app/dashboard/editor/services';
import { Lesson } from 'src/app/services/backend/schema/course_details';

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
    private editorService: EditorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }
  selectedSession;

  ngOnInit() {
    this.form = this.builder.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });

    this.form.setValue({ title: this.data.title, description: this.data.description });
  }

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  onSubmit(): void {
    if (this.form.valid) {
      const val = this.form.value;
      const l: Lesson = {
        id: this.data.id,
        lesson_name: val.title,
        lesson_description: val.description,
      };
      this.editorService
        .updateLesson(l, this.data.id)
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

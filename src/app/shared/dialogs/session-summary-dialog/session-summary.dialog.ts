import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { Lesson } from 'src/app/services/backend/schema/course_details';
@Component({
  selector: 'benji-session-summary-dialog',
  templateUrl: 'session-summary.dialog.html',
})
export class SessionSummaryDialogComponent implements OnInit {
  form: FormGroup;
  emailErr = false;
  emailErrMsg = '';
  invitationsSent = false;
  userId: number;
  orgId: number;
  eventsSubject: Subject<void> = new Subject<void>();
  focusTitle;
  focusDescription;
  constructor(
    private httpClient: HttpClient,
    private dialogRef: MatDialogRef<SessionSummaryDialogComponent>,
    private builder: FormBuilder,
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

  updateLesson(lesson: Lesson, id): Observable<any[]> {
    console.log(lesson);
    return this.httpClient.patch<any[]>(global.apiRoot + `/course_details/lesson/${id}/`, lesson);
  }

  onSubmit(): void {
    if (this.form.valid) {
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

// import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'benji-session-summary-dialog',
//   templateUrl: 'session-summary.dialog.html'
// })
// export class SessionSummaryDialogComponent implements OnInit {

//   roomCode;
//   placeholderTitle = "Give your session a name";
//   placeholderDescription = "This is where the instructions go...";
//   sessionTitle = "";
//   sessionDescription = "";
//   editingTitle: boolean = true;
//   editingDescription: boolean;
//   @ViewChild('title') TitleElement: ElementRef;
//   @ViewChild('description') DescriptionElement: ElementRef;

//   constructor(
//     private dialogRef: MatDialogRef<SessionSummaryDialogComponent>,
//     @Inject(MAT_DIALOG_DATA)
//     public data: {
//       title: string;
//       description: string;
//     },
//   ) {}

//   ngOnInit() {}

//   public selectDefault() {
//     this.dialogRef.close({});
//   }

//   public cancel() {
//     this.dialogRef.close();
//   }

//   editTitle() {
//     this.editingTitle = true;
//     setTimeout(() => {
//       this.TitleElement.nativeElement.focus();
//     }, 0);
//   }

//   saveEditedTitle() {
//     this.editingTitle = false;
//   }

//   editDescription() {
//     this.editingDescription = true;
//     setTimeout(() => {
//       this.DescriptionElement.nativeElement.focus();
//     }, 0);
//   }

//   saveEditedDescription() {
//     this.editingDescription = false;
//   }

//   onSubmit() {
//     this.dialogRef.close({
//       title: this.sessionTitle,
//       description: this.sessionDescription
//     });
//   }

// }
// z

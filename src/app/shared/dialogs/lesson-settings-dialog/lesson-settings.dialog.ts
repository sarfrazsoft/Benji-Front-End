import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fromEvent, Observable, Subject } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { AdminService } from 'src/app/dashboard/admin-panel/services/admin.service';
// import { EditorService } from 'src/app/dashboard/editor/services';
import * as global from 'src/app/globals';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'benji-lesson-settings-dialog',
  templateUrl: 'lesson-settings.dialog.html',
})
export class LessonSettingsDialogComponent implements OnInit {
  // public confirmationMessage: string;
  imagesList: FileList;
  imageURL;
  imgSrc;
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
    // private editorService: EditorService,
    private adminService: AdminService,
    private utilsService: UtilsService,
    private httpClient: HttpClient,
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
    this.imageURL = this.data.featureImage;
    // formControlName="imageURL" id="imageURL"
    this.form.setValue({ title: this.data.title, description: this.data.description });
  }

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  onFileSelect(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length === 0) {
      this.imagesList = null;
    } else {
      this.imagesList = fileList;
      this.uploadLessonImage(this.data.id, this.imagesList);
    }
  }

  editPhoto($event) {
    $event.preventDefault();
  }

  uploadLessonImage(lesson: number, imagesList) {
    const url = global.apiRoot + '/course_details/lesson/' + lesson + '/upload_feature_image/';
    const fileList: FileList = imagesList;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      return this.utilsService
        .resizeImage({
          file: file,
          maxSize: 500,
        })
        .then((resizedImage: Blob) => {
          const formData: FormData = new FormData();
          formData.append('img', resizedImage, file.name);
          const headers = new HttpHeaders();
          headers.set('Content-Type', null);
          headers.set('Accept', 'multipart/form-data');
          const params = new HttpParams();
          this.httpClient
            .post(url, formData, { params, headers })
            .map((res: any) => {
              this.imageURL = res.img;
            })
            .subscribe(
              (data) => {},
              (error) => console.log(error)
            );
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const val = this.form.value;
      const l: Lesson = {
        id: this.data.id,
        lesson_name: val.title,
        lesson_description: val.description,
      };
      this.adminService
        .updateLesson(l, this.data.id)
        .pipe(
          map((res) => res),
          catchError((error) => error)
        )
        .subscribe((res: Lesson) => {
          l.feature_image = this.imageURL;
          this.dialogRef.close(l);
        });
    }
  }
}

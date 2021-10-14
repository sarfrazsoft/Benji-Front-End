import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fromEvent, Observable, Subject } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { EditorService } from 'src/app/dashboard/editor/services';
import * as global from 'src/app/globals';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'benji-image-picker-dialog',
  templateUrl: 'image-picker.dialog.html',
})
export class ImagePickerDialogComponent implements OnInit {
  // public confirmationMessage: string;
  imagesList: FileList;
  imageURL;
  form: FormGroup;
  emailErr = false;
  emailErrMsg = '';
  invitationsSent = false;
  userId: number;
  orgId: number;
  eventsSubject: Subject<void> = new Subject<void>();
  images;
  typingTimer;
  constructor(
    private dialogRef: MatDialogRef<ImagePickerDialogComponent>,
    private builder: FormBuilder,
    private utilsService: UtilsService,
    private httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }
  selectedSession;

  ngOnInit() {
    this.form = this.builder.group({
      title: new FormControl('e', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });

    this.form.setValue({ title: 'e', description: 'this.data.description' });
  }

  // get title(): AbstractControl {
  //   return this.form.get('title');
  // }

  // get description(): AbstractControl {
  //   return this.form.get('description');
  // }

  // onFileSelect(event) {
  //   const fileList: FileList = event.target.files;
  //   if (fileList.length === 0) {
  //     this.imagesList = null;
  //   } else {
  //     this.imagesList = fileList;
  //     this.uploadLessonImage(this.data.id, this.imagesList);
  //   }
  // }

  editPhoto($event) {
    $event.preventDefault();
  }

  // uploadLessonImage(lesson: number, imagesList) {
  //   const url = global.apiRoot + '/course_details/lesson/' + lesson + '/upload_feature_image/';
  //   const fileList: FileList = imagesList;
  //   if (fileList.length > 0) {
  //     const file: File = fileList[0];
  //     return this.utilsService
  //       .resizeImage({
  //         file: file,
  //         maxSize: 500,
  //       })
  //       .then((resizedImage: Blob) => {
  //         const formData: FormData = new FormData();
  //         formData.append('img', resizedImage, file.name);
  //         const headers = new HttpHeaders();
  //         headers.set('Content-Type', null);
  //         headers.set('Accept', 'multipart/form-data');
  //         const params = new HttpParams();
  //         this.httpClient
  //           .post(url, formData, { params, headers })
  //           .map((res: any) => {
  //             this.imageURL = res.img;
  //           })
  //           .subscribe(
  //             (data) => {},
  //             (error) => console.log(error)
  //           );
  //       })
  //       .catch(function (err) {
  //         console.error(err);
  //       });
  //   }
  // }

  // onSubmit(): void {
  //   if (this.form.valid) {
  //     const val = this.form.value;
  //     const l: Lesson = {
  //       id: this.data.id,
  //       lesson_name: val.title,
  //       lesson_description: val.description,
  //     };
  // this.editorService
  //   .updateLesson(l, this.data.id)
  //   .pipe(
  //     map((res) => res),
  //     catchError((error) => error)
  //   )
  //   .subscribe((res: Lesson) => {
  //     l.feature_image = this.imageURL;
  //     this.dialogRef.close(l);
  //   });
  //   }
  // }

  typingStoped(query) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      // this.getUnsplashImages(query);
    }, 1000);
  }
  typingStarted() {
    clearTimeout(this.typingTimer);
  }

  unsplashImageSelected(url) {
    // console.log(url);
    // this.dialogRef.close(url);
    this.dialogRef.close({ type: 'unsplash', data: url });
  }

  giphyImageSelected(url) {
    // console.log(url);
    // this.dialogRef.close(url);
    this.dialogRef.close({ type: 'giphy', data: url });
  }

  uploadImageSelected($event) {
    console.log($event);
    this.dialogRef.close({ type: 'upload', data: $event });
  }
}

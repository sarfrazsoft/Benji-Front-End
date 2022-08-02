import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { UtilsService } from 'src/app/services/utils.service';
import { ImagePickerDialogComponent } from '../image-picker-dialog/image-picker.dialog';
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
  showEdit: boolean;
  imageDialogRef: any;
  imagesList: any;
  coverPhoto: string | ArrayBuffer;
  selectedImage: Blob;
  imageUrl: string;
  selectedImageName: string;
  
  hostLocation = 'https://staging.mybenji.com' // window.location.host;

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<SessionSettingsDialogComponent>,
    private builder: FormBuilder,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  selectedSession;

  ngOnInit() {
    this.form = this.builder.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });
    this.form.setValue({ title: this.data.title, description: this.data.description });
    this.createSession = this.data.createSession;

    if (this.data.lessonImage || this.data.imageUrl) {
      this.coverPhoto = this.data.lessonImage? this.hostLocation + this.data.lessonImage : this.data.imageUrl;
    }
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
        selectedImage: this.selectedImage,
        selectedImageName: this.selectedImageName,
        imageUrl: this.imageUrl,
      });
    } else if (this.form.valid) {
      const val = this.form.value;
      const l: any = {
        lesson_name: val.title,
        lesson_description: val.description,
        index: this.data.index,
        lesson_image: this.selectedImage,
        lesson_image_name: this.selectedImageName,
        image_url: this.imageUrl,
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
  
  openImagePickerDialog() {
    this.imageDialogRef = this.matDialog
      .open(ImagePickerDialogComponent, {
        disableClose: false,
        panelClass: ['dashboard-dialog', 'image-picker-dialog'],
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          if (res.type === 'upload') {
            this.imagesList = res.data;
            const fileList: FileList = res.data;
            const file: File = fileList[0];
            const reader = new FileReader();
            reader.onload = (e) => {
              this.coverPhoto = reader.result;
            };
            reader.readAsDataURL(file);
            this.utilsService
            .resizeImage({
              file: file,
              maxSize: 1500,
            })
            .then((resizedImage: Blob) => {
              this.selectedImage = resizedImage;
              this.selectedImageName = file.name;
            })
            .catch(function (err) {
              console.error(err);
            });
          } else if (res.type === 'unsplash') {
            this.coverPhoto = res.data;
            this.imageUrl = res.data;
          }
        }
      });
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';

export interface ImagePickerDialogData {
  onlyUnsplash?: boolean;
  lessonRunCode?: any;
}

export interface DialogResult {
  type: 'unsplash' | 'upload';
  data: any;
}

@Component({
  selector: 'benji-image-picker-dialog',
  templateUrl: 'image-picker.dialog.html',
})
export class ImagePickerDialogComponent implements OnInit {
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
  onlyUnsplash: boolean;
  selectedSession;

  constructor(
    private dialogRef: MatDialogRef<ImagePickerDialogComponent>,
    private builder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ImagePickerDialogData
  ) {}

  ngOnInit() {
    this.form = this.builder.group({
      title: new FormControl('e', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });

    this.form.setValue({ title: 'e', description: 'this.data.description' });

    this.onlyUnsplash = this.data?.onlyUnsplash;
  }

  editPhoto($event) {
    $event.preventDefault();
  }

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
    const dialogResult: DialogResult = { type: 'unsplash', data: url };
    this.dialogRef.close(dialogResult);
  }

  uploadImageSelected($event) {
    const dialogResult: DialogResult = { type: 'upload', data: $event };
    this.dialogRef.close(dialogResult);
  }
}

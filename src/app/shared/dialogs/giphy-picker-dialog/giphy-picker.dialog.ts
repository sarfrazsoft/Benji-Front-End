import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'benji-giphy-picker-dialog',
  templateUrl: 'giphy-picker.dialog.html',
})
export class GiphyPickerDialogComponent implements OnInit {
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
    private dialogRef: MatDialogRef<GiphyPickerDialogComponent>,
    private builder: FormBuilder,
  ) {}
  selectedSession;

  ngOnInit() {
    this.form = this.builder.group({
      title: new FormControl('e', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });

    this.form.setValue({ title: 'e', description: 'this.data.description' });
  }

  editPhoto($event) {
    $event.preventDefault();
  }

  typingStoped(query) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
    }, 1000);
  }
  typingStarted() {
    clearTimeout(this.typingTimer);
  }

  giphyImageSelected(url) {
    this.dialogRef.close({ type: 'giphy', data: url });
  }

}

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'benji-image-view-dialog',
  templateUrl: 'image-view.dialog.html',
})
export class ImageViewDialogComponent {
  roomCode;
  imageUrl;

  constructor(
    private dialogRef: MatDialogRef<ImageViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.imageUrl = data.imageUrl;
  }
}

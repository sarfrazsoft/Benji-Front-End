import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import * as global from 'src/app/globals';

@Component({
  selector: 'benji-upload-image-picker',
  templateUrl: 'upload-image.component.html',
})
export class UploadImageComponent implements OnInit {
  imagesList: FileList;
  imageSrc;
  @Output() imageSelected = new EventEmitter<any>();
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {}

  setImage(url) {
    console.log(url);
    this.imageSelected.emit(url);
  }

  onFileSelect(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length === 0) {
      this.imagesList = null;
    } else {
      this.imagesList = fileList;
      // set the imageSrc for preview thumbnail
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);

      console.log(this.imagesList);
      this.imageSelected.emit(this.imagesList);
    }
  }
}

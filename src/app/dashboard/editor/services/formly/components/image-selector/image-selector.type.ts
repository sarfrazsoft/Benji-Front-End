import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import * as global from 'src/app/globals';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'benji-image-selector',
  templateUrl: './image-selector.type.html',
})
export class ImageSelectorComponent extends FieldType implements OnInit {
  imagesList: FileList;

  constructor(private utilsService: UtilsService, private httpClient: HttpClient) {
    super();
  }

  public ngOnInit() {}

  stop(event) {
    event.stopPropagation();
  }

  onFileSelect(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length === 0) {
      this.imagesList = null;
    } else {
      this.imagesList = fileList;
      this.uploadFile();
    }
  }

  uploadFile() {
    const code = '1234';
    const url = global.apiRoot + '/course_details/lesson_run/' + code + '/upload_image/';
    const participant_code = '1234';
    const fileList: FileList = this.imagesList;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.utilsService
        .resizeImage({
          file: file,
          maxSize: 500,
        })
        .then((resizedImage: Blob) => {
          const formData: FormData = new FormData();
          formData.append('img', resizedImage, file.name);
          formData.append('participant_code', participant_code);
          const headers = new HttpHeaders();
          headers.set('Content-Type', null);
          headers.set('Accept', 'multipart/form-data');
          const params = new HttpParams();
          this.httpClient
            .post(url, formData, { params, headers })
            .map((res: any) => {
              this.imagesList = null;
              // this.sendMessage.emit(
              //   new BrainstormSubmitEvent(this.userIdeaText, this.selectedCategory.id, res.id)
              // );
              // this.userIdeaText = '';
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
}

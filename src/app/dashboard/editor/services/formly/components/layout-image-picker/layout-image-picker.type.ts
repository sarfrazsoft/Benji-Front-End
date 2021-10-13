import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldType } from '@ngx-formly/core';
import * as global from 'src/app/globals';
import { UtilsService } from 'src/app/services/utils.service';
import { ImagePickerDialogComponent } from 'src/app/shared/dialogs/image-picker-dialog/image-picker.dialog';

@Component({
  selector: 'benji-layout-image-picker-type',
  templateUrl: './layout-image-picker.type.html',
})
export class LayoutImagePickerTypeComponent extends FieldType implements OnInit, OnChanges {
  imagesList: FileList;
  imageSrc = null;
  imageDialogRef;
  selectedImageUrl;
  imgSrc;
  lessonId;
  imgUploaded: boolean;
  imgId: string;
  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private httpClient: HttpClient
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    if(this.formControl.value) {
      this.imgUploaded = true;
      let imgUrl = this.formControl.value;
      if (imgUrl.search('mybenji') !== -1) {
        this.imageSrc = imgUrl;
        this.selectedImageUrl = null;
      } else {
        this.selectedImageUrl = imgUrl;
        this.imgSrc = null;
      }
    } else {
      this.imgSrc = '/assets/img/slideImageUploadIcon.svg';
      this.imgUploaded = false;
    }
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.lessonId = paramMap.get('lessonId');
    });
  }

  removeImage() {
    console.log(this.imageSrc);
    if(this.imageSrc !== null) {
      const url = global.apiRoot + '/course_details/lesson/' + this.lessonId + '/delete/png/image/';
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      const params = { image_id: this.imgId };
      this.httpClient
        .post(url, params)
        .map((res: any) => {
          this.imgUploaded = false;
          this.formControl.setValue(null);
        })
        .subscribe(
          (data) => {},
          (error) => console.log(error)
        );
    } else if(this.selectedImageUrl !== null) {
      this.selectedImageUrl = null;
      this.imgUploaded = false;
      this.formControl.setValue(null);
    }
    
  }

  openImagePickerDialog() {
    this.imageDialogRef = this.dialog
      .open(ImagePickerDialogComponent, {
        data: {
          //  lessonRunCode: code,
        },
        disableClose: false,
        panelClass: ['dashboard-dialog', 'image-picker-dialog'],
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          if (res.type === 'upload') {
            const url =
              global.apiRoot + '/course_details/lesson/' + this.lessonId + '/upload/title_activity/image/';
            const fileList: FileList = res.data;
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
                  const headers = new HttpHeaders();
                  headers.set('Content-Type', null);
                  headers.set('Accept', 'multipart/form-data');
                  const params = new HttpParams();
                  this.httpClient
                    .post(url, formData, { params, headers })
                    .map((res: any) => {
                      this.imgId = res.id;
                      this.imagesList = null;
                      this.formControl.setValue(res.img);
                    })
                    .subscribe(
                      (data) => {
                        this.imgUploaded = true;
                        //this.selectedImageUrl = null;
                      },
                      (error) => console.log(error)
                    );
                })
                .catch(function (err) {
                  console.error(err);
                });
              const reader = new FileReader();
              reader.onload = (e) => (this.imageSrc = reader.result);
              reader.readAsDataURL(file);
            }
          } else if (res.type === 'unsplash') {
            console.log(res);
            this.selectedImageUrl = res.data;
            this.formControl.setValue(res.data);
            this.imgUploaded = true;
            this.imageSrc = null;
          } else if (res.type === 'giphy') {
            this.selectedImageUrl = res.data;
            this.formControl.setValue(res.data);
            this.imgUploaded = true;
            this.imageSrc = null;
          }
        }
      });
  }
}

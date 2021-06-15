import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FieldType } from '@ngx-formly/core';
import * as global from 'src/app/globals';
import { UtilsService } from 'src/app/services/utils.service';
import { ImagePickerDialogComponent } from 'src/app/shared/dialogs/image-picker-dialog/image-picker.dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'benji-layout-image-picker-type',
  templateUrl: './layout-image-picker.type.html',
})
export class LayoutImagePickerTypeComponent extends FieldType implements OnInit, OnChanges {
 
  imagesList: FileList;
  imageSrc;
  imageDialogRef;
  selectedImageUrl;

  lessonId;

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private httpClient: HttpClient ) {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.lessonId = paramMap.get('lessonId');
    });
  }

  openImagePickerDialog(){
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
            //course_details/lesson/{id}/{mode}/{image_type}/image/
            console.log(res);
            const url = global.apiRoot + '/course_details/lesson/' + this.lessonId + '/upload/title_activity/image/';
            console.log(url);
            const fileList: FileList = res.data;
            if (fileList.length > 0) {
              const file: File = fileList[0];
              this.utilsService.resizeImage({
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
                      this.imagesList = null;
                      console.log(res);
                      this.formControl.setValue(res.img)
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
              const reader = new FileReader();
              reader.onload = (e) => (this.imageSrc = reader.result);
              reader.readAsDataURL(file);
              console.log(this.imageSrc)
            }
          } else if (res.type === 'unsplash') {
            console.log(res);
            this.selectedImageUrl = res.data;
            this.formControl.setValue(res.data)
          } else if (res.type === 'giphy') {
            this.selectedImageUrl = res.data;
            this.formControl.setValue(res.data)
          }
          console.log(res);
          // this.sendMessage.emit(new BrainstormSubmitEvent(this.userIdeaText, this.selectedCategory.id, res));
        }
      });
  }

}

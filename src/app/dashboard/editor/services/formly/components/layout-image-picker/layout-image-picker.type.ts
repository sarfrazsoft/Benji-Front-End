import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FieldType } from '@ngx-formly/core';
import { UtilsService } from 'src/app/services/utils.service';
import { ImagePickerDialogComponent } from 'src/app/shared/dialogs/image-picker-dialog/image-picker.dialog';

@Component({
  selector: 'benji-layout-image-picker-type',
  templateUrl: './layout-image-picker.type.html',
  styleUrls: [ './layout-image-picker.type.scss' ]
})
export class LayoutImagePickerTypeComponent extends FieldType implements OnInit, OnChanges {
 
  imagesList: FileList;
  imageSrc;
  imageDialogRef;
  selectedImageUrl;
  
  constructor(
    private dialog: MatDialog  ) {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
            this.imagesList = res.data;
            // this.imagesList = fileList;
            // set the imageSrc for preview thumbnail
            // const fileList: FileList = event.target.files;
            const fileList: FileList = res.data;
            const file = fileList[0];
            const reader = new FileReader();
            reader.onload = () => (this.imageSrc = reader.result);
            reader.readAsDataURL(file);
          } else if (res.type === 'unsplash') {
            console.log(res);
            this.selectedImageUrl = res.data;
          } else if (res.type === 'giphy') {
            this.selectedImageUrl = res.data;
          }
          console.log(res);
          // this.sendMessage.emit(new BrainstormSubmitEvent(this.userIdeaText, this.selectedCategory.id, res));
        }
      });
  }

}

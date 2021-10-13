import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/services/backend/schema';
import { ImagePickerDialogComponent } from '../image-picker-dialog/image-picker.dialog';

@Component({
  selector: 'benji-idea-creation-dialog',
  templateUrl: 'idea-creation.dialog.html',
})
export class IdeaCreationDialogComponent {
  showCategoriesDropdown = false;
  categories: Array<Category> = [];
  selectedCategory: Category;
  userIdeaText = '';
  lessonRunCode;
  imageSelected = false;

  imagesList: FileList;
  imageSrc;
  imageDialogRef;
  selectedImageUrl;
  constructor(
    private dialogRef: MatDialogRef<IdeaCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { showCategoriesDropdown: boolean; categories: Array<Category> },
    private matDialog: MatDialog
  ) {
    this.showCategoriesDropdown = data.showCategoriesDropdown;
    this.categories = data.categories;
    if (this.categories.length) {
      this.selectedCategory = this.categories[0];
    }
    console.log(data);
  }

  onSubmit() {
    this.dialogRef.close({
      text: this.userIdeaText,
      category: this.selectedCategory,
      imagesList: this.imagesList,
      selectedImageUrl: this.selectedImageUrl,
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  removeImage() {
    this.imageSelected = false;
    this.imagesList = null;
    this.imageSrc = null;
    this.selectedImageUrl = null;
  }

  openImagePickerDialog() {
    const code = this.lessonRunCode;
    this.imageDialogRef = this.matDialog
      .open(ImagePickerDialogComponent, {
        data: {
          lessonRunCode: code,
        },
        disableClose: false,
        panelClass: ['dashboard-dialog', 'image-picker-dialog'],
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          if (res.type === 'upload') {
            this.imageSelected = true;
            this.imagesList = res.data;
            const fileList: FileList = res.data;
            const file = fileList[0];
            const reader = new FileReader();
            reader.onload = (e) => (this.imageSrc = reader.result);
            reader.readAsDataURL(file);
          } else if (res.type === 'unsplash') {
            this.selectedImageUrl = res.data;
            this.imageSelected = true;
          } else if (res.type === 'giphy') {
            this.selectedImageUrl = res.data;
            this.imageSelected = true;
          }
        }
      });
  }
}

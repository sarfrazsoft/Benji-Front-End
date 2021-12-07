import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/services/backend/schema';
import { ConfirmationDialogComponent } from '../confirmation/confirmation.dialog';
import { ImagePickerDialogComponent } from '../image-picker-dialog/image-picker.dialog';

@Component({
  selector: 'benji-idea-creation-dialog',
  templateUrl: 'idea-creation.dialog.html',
})
export class IdeaCreationDialogComponent implements OnInit {
  showCategoriesDropdown = false;
  categories: Array<Category> = [];
  selectedCategory: Category;
  userIdeaText = '';
  ideaTitle = '';
  lessonRunCode;
  imageSelected = false;

  imagesList: FileList;
  imageSrc;
  imageDialogRef;
  selectedImageUrl;
  @HostListener('window:keyup.esc') onKeyUp() {
    if (this.userIdeaText.length || this.ideaTitle.length) {
      this.askUserConfirmation();
    } else {
      this.dialogRef.close();
    }
  }

  // @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
  //   console.log('event:', event);
  //   event.returnValue = false;
  // }
  constructor(
    private dialogRef: MatDialogRef<IdeaCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { showCategoriesDropdown: boolean; categories: Array<Category> },
    private matDialog: MatDialog
  ) {
    this.showCategoriesDropdown = data.showCategoriesDropdown;
    console.log(data.categories.filter((val) => !val.removed));
    this.categories = data.categories.filter((val) => !val.removed);
    if (this.categories.length) {
      this.selectedCategory = this.categories[0];
    }
  }

  ngOnInit() {
    this.dialogRef.disableClose = true;

    this.dialogRef.backdropClick().subscribe((_) => {
      if (this.userIdeaText.length || this.ideaTitle.length) {
        this.askUserConfirmation();
      } else {
        this.dialogRef.close();
      }
    });
  }

  askUserConfirmation() {
    this.matDialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: 'Are you sure you want to close without posting the card',
          actionButton: 'close',
        },
        disableClose: true,
        panelClass: 'dashboard-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.dialogRef.close();
        } else {
        }
      });
  }

  onSubmit() {
    this.dialogRef.close({
      text: this.userIdeaText,
      title: this.ideaTitle,
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
            reader.onload = (e) => {
              this.imageSrc = reader.result;
            };
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

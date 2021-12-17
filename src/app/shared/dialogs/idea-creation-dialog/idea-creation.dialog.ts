import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, map } from 'rxjs/operators';
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
  selectedThirdPartyImageUrl;
  pdfSelected;
  selectedpdfDoc;
  pdfSrc;
  lessonID;
  @ViewChild('pdfViewerAutoLoad') pdfViewerAutoLoad;
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
    public data: {
      showCategoriesDropdown: boolean;
      categories: Array<Category>;
      lessonID: number;
      category?: Category;
    },
    private matDialog: MatDialog
  ) {
    this.showCategoriesDropdown = data.showCategoriesDropdown;

    this.categories = data.categories.filter((val) => !val.removed);
    if (this.categories.length) {
      this.selectedCategory = this.categories[0];
    }
    this.lessonID = data.lessonID;

    if (data.category) {
      this.selectedCategory = data.category;
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
      selectedThirdPartyImageUrl: this.selectedThirdPartyImageUrl,
      selectedpdfDoc: this.selectedpdfDoc,
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  removeImage() {
    this.imageSelected = false;
    this.imagesList = null;
    this.imageSrc = null;
    this.selectedThirdPartyImageUrl = null;
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
            this.selectedThirdPartyImageUrl = res.data;
            this.imageSelected = true;
          } else if (res.type === 'giphy') {
            this.selectedThirdPartyImageUrl = res.data;
            this.imageSelected = true;
          }
        }
      });
  }

  uploadFile(event) {
    // console.log($event.target.files[0]); // outputs the first file
    // const file = $event.target.files[0];
    const fileList: FileList = event.target.files;
    if (fileList.length === 0) {
      this.imagesList = null;
    } else {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.pdfSrc = reader.result);
      reader.readAsDataURL(file);
      this.selectedpdfDoc = file;
      this.pdfSelected = true;
      this.imageSelected = true;
      // this.pdfSelected = true;
      // this.imageSelected = true;
      // const file = fileList[0];
      // this.selectedpdfDoc = file;
      // setTimeout(() => {
      //   this.pdfViewerAutoLoad.pdfSrc = file;
      //   this.pdfViewerAutoLoad.refresh();
      // }, 0);
    }
  }
}

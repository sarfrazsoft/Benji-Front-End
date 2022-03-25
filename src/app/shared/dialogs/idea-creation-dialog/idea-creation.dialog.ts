import { AfterViewInit, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Uppy from '@uppy/core';
import GoogleDrive from '@uppy/google-drive';
import Tus from '@uppy/tus';
import Webcam from '@uppy/webcam';
import XHRUpload from '@uppy/xhr-upload';
import { catchError, map } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { Category, IdeaDocument } from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
import uploadcare from 'uploadcare-widget';
import { ConfirmationDialogComponent } from '../confirmation/confirmation.dialog';
import { GiphyPickerDialogComponent } from '../giphy-picker-dialog/giphy-picker.dialog';
import { ImagePickerDialogComponent } from '../image-picker-dialog/image-picker.dialog';
@Component({
  selector: 'benji-idea-creation-dialog',
  templateUrl: 'idea-creation.dialog.html',
})
export class IdeaCreationDialogComponent implements OnInit, AfterViewInit {
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

  // video variables
  videoURL: string;
  video = false;
  video_id: number;

  webcamImageId: number;
  webcamImage = false;
  webcamImageURL: string;
  hostname = environment.web_protocol + '://' + environment.host;

  @ViewChild('pdfViewerAutoLoad') pdfViewerAutoLoad;
  @ViewChild('uploadcarewidget') uploadcarewidget;
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

    // document.addEventListener('DOMContentLoaded', () => {

    // });
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
    console.log('hello');
    uploadcare.Widget('[name="file"]', {
      publicKey: '71eac221885fa40dc817',
      tabs: 'camera',
      videoPreferredMimeTypes: ['video/mp4'],
    });
    // const widget = uploadcare.Widget(this.uploadcarewidget, { publicKey: '71eac221885fa40dc817' });
  }

  ngAfterViewInit(): void {}

  askUserConfirmation() {
    this.matDialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: 'Are you sure you want to close without posting the card',
          actionButton: 'Close',
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
      video_id: this.video_id,
      webcamImageId: this.webcamImageId,
    });
  }

  closeDialog() {
    this.dialogRef.close();
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
          this.clearPDF();
          this.removeImage();
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
          }
        }
      });
  }

  openGiphyPickerDialog() {
    const code = this.lessonRunCode;
    this.imageDialogRef = this.matDialog
      .open(GiphyPickerDialogComponent, {
        data: {
          lessonRunCode: code,
        },
        disableClose: false,
        panelClass: ['dashboard-dialog', 'giphy-picker-dialog'],
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.clearPDF();
          this.removeImage();
          if (res.type === 'giphy') {
            this.selectedThirdPartyImageUrl = res.data;
            this.imageSelected = true;
          }
        }
      });
  }

  uploadFile(event) {
    const fileList: FileList = event.target.files;
    this.clearPDF();
    this.removeImage();
    if (fileList.length === 0) {
      this.imagesList = null;
    } else {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.pdfSrc = reader.result);
      reader.readAsDataURL(file);
      this.selectedpdfDoc = file;
      this.pdfSelected = true;
    }
  }

  remove() {
    if (this.pdfSelected) {
      this.clearPDF();
    } else if (this.imageSelected) {
      this.removeImage();
    } else if (this.webcamImage) {
      this.removeWebcamImage();
    } else if (this.imageSelected) {
      this.removeImage();
    } else if (this.video) {
      this.removeVideo();
    }
  }

  removeImage() {
    this.imageSelected = false;
    this.imagesList = null;
    this.imageSrc = null;
    this.selectedThirdPartyImageUrl = null;
  }

  clearPDF() {
    this.selectedpdfDoc = null;
    this.pdfSelected = false;
    this.pdfSrc = null;
  }

  removeWebcamImage() {
    this.webcamImage = false;
    this.webcamImageId = null;
    this.webcamImageURL = null;
  }

  removeVideo() {
    this.videoURL = null;
    this.video = false;
    this.video_id = null;
  }

  mediaUploaded(res: IdeaDocument) {
    if (res.document_type === 'video') {
      this.videoURL = res.document;
      this.video = true;
      this.video_id = res.id;
    } else if (res.document_type === 'image') {
      this.webcamImageId = res.id;
      this.webcamImageURL = res.document;
      this.webcamImage = true;
    }
  }
}

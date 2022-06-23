import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category, IdeaDocument } from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
import { FileProgress } from '../../components/uploadcare-widget/uploadcare-widget.component';
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
  selectedpdfDocId;
  pdfSrc;
  lessonID;

  // video variables
  videoURL: string;
  videoURLConverted: string;
  video = false;
  video_id: number;

  webcamImageId: number;
  webcamImage = false;
  webcamImageURL: string;
  hostname = environment.web_protocol + '://' + environment.host;
  mediaUploading = false;
  descriptionIsEmpty = true;
  fileProgress: FileProgress;

  @ViewChild('pdfViewerAutoLoad') pdfViewerAutoLoad;

  @HostListener('window:keyup.esc') onKeyUp() {
    if (this.userIdeaText.length || this.ideaTitle.length) {
      this.askUserConfirmation();
    } else {
      this.dialogRef.close();
    }
  }

  constructor(
    private dialogRef: MatDialogRef<IdeaCreationDialogComponent>,
    private httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      showCategoriesDropdown: boolean;
      categories: Array<Category>;
      lessonRunCode: number;
      category?: Category;
    },
    private matDialog: MatDialog
  ) {
    this.showCategoriesDropdown = data.showCategoriesDropdown;

    this.categories = data.categories.filter((val) => !val.removed);
    if (this.categories.length) {
      this.selectedCategory = this.categories[0];
    }
    this.lessonID = data.lessonRunCode;
    this.lessonRunCode = data.lessonRunCode;

    if (data.category) {
      this.selectedCategory = data.category;
    }
  }

  ngOnInit() {
    this.dialogRef.disableClose = true;

    this.dialogRef.backdropClick().subscribe((_) => {
      if (this.userIdeaText.length || this.ideaTitle.length || this.isItemSelected()) {
        this.askUserConfirmation();
      } else {
        this.dialogRef.close();
      }
    });
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
        panelClass: 'confirmation-dialog',
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
      selectedpdfDoc: this.selectedpdfDocId,
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

  // uploadFile(event) {
  //   const fileList: FileList = event.target.files;
  //   this.clearPDF();
  //   this.removeImage();
  //   if (fileList.length === 0) {
  //     this.imagesList = null;
  //   } else {
  //     const file = fileList[0];
  //     const reader = new FileReader();
  //     reader.onload = (e) => (this.pdfSrc = reader.result);
  //     reader.readAsDataURL(file);
  //     this.selectedpdfDoc = file;
  //     this.pdfSelected = true;
  //   }
  // }

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
    this.videoURLConverted = null;
    this.video = false;
    this.video_id = null;
  }

  mediaUploadProgress(fileProgress: FileProgress) {
    this.fileProgress = fileProgress;
    this.mediaUploading = true;
  }

  mediaUploaded(res: IdeaDocument) {
    this.mediaUploading = false;
    if (res.document_type === 'video') {
      if (res.document_url) {
        this.videoURL = res.document_url;
        this.videoURLConverted = res.document_url_converted;
      } else if (res.document) {
        this.videoURL = res.document;
      }
      this.video = true;
      this.video_id = res.id;
    } else if (res.document_type === 'image') {
      if (res.document_url) {
        this.webcamImageURL = res.document_url;
      } else if (res.document) {
        this.webcamImageURL = res.document;
      }
      this.webcamImage = true;
      this.webcamImageId = res.id;
    } else if (res.document_type === 'document') {
      this.selectedpdfDocId = res.id;
      if (res.document_url_converted) {
        this.pdfSrc = res.document_url_converted;
      } else {
        this.pdfSrc = res.document_url;
      }
      // this.pdfSrc = 'https://ucarecdn.com/7d9330de-a6be-497d-9a4c-3af802a63a2e/';
      this.webcamImage = false;
      this.video = false;
      this.pdfSelected = true;
    }
  }

  isItemSelected() {
    if (!this.imageSelected && !this.pdfSelected && !this.video && !this.webcamImage) {
      return false;
    }
    if (this.imageSelected || this.pdfSelected || this.video || this.webcamImage) {
      return true;
    }
    return false;
  }

  descriptionTextChanged($event: string) {
    this.userIdeaText = $event;
    $event.length === 7 ? (this.descriptionIsEmpty = true) : (this.descriptionIsEmpty = false);
  }
}

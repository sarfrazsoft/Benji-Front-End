import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { distinctUntilChanged, skipWhile, switchMap, takeWhile, tap } from 'rxjs/operators';
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
  pdfExists = false;
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

  iframeData;
  iframeAvailable = false;

  meta;

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
      meta: this.meta,
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
          this.removeIframelyEmbed();
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
          this.removeIframelyEmbed();
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

  removeIframelyEmbed() {
    this.iframeAvailable = false;
    this.iframeData = undefined;
    this.meta = { ...this.meta, iframe: null };
  }

  mediaUploadProgress(fileProgress: FileProgress) {
    this.fileProgress = fileProgress;
    this.mediaUploading = true;
  }

  mediaUploaded(res: IdeaDocument) {
    this.mediaUploading = false;
    this.removeIframelyEmbed();
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
      this.pdfExists = true;
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
    this.checkIfLink(this.userIdeaText);
  }

  checkPdfExists(pdfSrc) {
    const timer$ = timer(0, 1000);
    timer$.subscribe(() => {
      const json$ = ajax.getJSON(pdfSrc);
      json$.subscribe(
        (res) => {
          this.pdfExists = true;
        },
        (err) => {
          console.log(err);
        }
      );
    });
    // const url = `${global.apiRoot}/course_details/${check}/status/${token}/`;
    // const timer$ = timer(0, 1000);
    // timer$
    //   .pipe(
    //     () => ajax.getJSON(pdfSrc)
    //     // takeWhile((res: any) => {
    //     //   return true;
    //     // }, true)
    //     // skipWhile((res: any) => this.isConversionInProgress(res))
    //   )
    //   .subscribe(
    //     (res) => {
    //       console.log(res);
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
    // console.log('hu');
    // const timer$ = timer(0, 1000);
    // timer$
    //   // .pipe(() => ajax.getJSON(pdfSrc))
    //   .subscribe(
    //     (res) => {
    //       console.log(res);
    //     },
    //     (err) => {
    //       this.pdfExists = false;
    //     }
    //   );
    // const interval;
    // const pdf$ = ajax.getJSON(pdfSrc);
    // pdf$.subscribe(
    //   (v) => {
    //     this.pdfExists = true;
    //     console.log(v);
    //     return v;
    //   },
    //   (err) => {
    //     this.pdfExists = false;
    //   }
    // );
  }

  doesPdfExist(pdfSrc) {
    // retirm;
    // pdf$ = ajax.getJSON(pdfSrc);
    // return pdf$.subscribe(
    //   (v) => {
    //     console.log(v);
    //     return v;
    //   },
    //   (err) => {}
    // );
  }

  checkIfLink(link: string) {
    if (this.isItemSelected()) {
      // Don't run if an item is already attached to the post
      return;
    }
    // link can be
    // https://something.com
    // abc https://something.com
    // https://www.canadianstage.com/
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    const link2 = link.match(urlRegex);
    if (link2) {
      // send to iframely
      this.httpClient
        .get(`https://cdn.iframe.ly/api/iframely/?api_key=a8a6ac85153a6cb7d321bc&url=${link2[0]}`)
        .subscribe((res: any) => {
          this.iframeAvailable = true;
          console.log(res.html);
          this.iframeData = { iframeHTML: res.html, url: res.url };
          this.meta = { ...this.meta, iframe: this.iframeData };
          // iframely.load();
        });
    }
    console.log(link2);
    // if (link.includes('https://')) {
    //   link.slice(link.indexOf('https://'), link.substring);
    //   link = link.trim();
    //   link = link.split(' ');
    // }
    // console.log(link);
  }
}

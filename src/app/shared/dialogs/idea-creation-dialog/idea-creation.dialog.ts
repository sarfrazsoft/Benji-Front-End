import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
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
declare var MediaRecorder: any;
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

  widgetRef;

  videoTypes = ['webm', 'ogg', 'mp4', 'x-matroska'];
  codecs = [
    'vp9',
    'vp9.0',
    'vp8',
    'vp8.0',
    'avc1',
    'av1',
    'h265',
    'h.265',
    'h264',
    'h.264',
    'opus',
    'pcm',
    'aac',
    'mpeg',
    'mp4a',
  ];
  //   editor = new Editor({
  //     extensions: [StarterKit],
  //     editorProps: {
  //       attributes: {
  //         class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
  //       },
  //     },
  //   });
  //   value = `
  //   <h2>
  //     Hi there,
  //   </h2>
  //   <p>
  //     this is a basic <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
  //   </p>
  //   <ul>
  //     <li>
  //       That’s a bullet list with one …
  //     </li>
  //     <li>
  //       … or two list items.
  //     </li>
  //   </ul>
  //   <p>
  //     Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
  //   </p>
  // <pre><code class="language-css">body {
  // display: none;
  // }</code></pre>
  //   <p>
  //     I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
  //   </p>
  //   <blockquote>
  //     Wow, that’s amazing. Good work, boy! 👏
  //     <br />
  //     — Mom
  //   </blockquote>
  // `;

  @ViewChild('pdfViewerAutoLoad') pdfViewerAutoLoad;
  @ViewChild('uploadcarewidget') uploadcarewidget;
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
      if (this.userIdeaText.length || this.ideaTitle.length) {
        this.askUserConfirmation();
      } else {
        this.dialogRef.close();
      }
    });

    const supportedVideos = this.getSupportedMimeTypes('video', this.videoTypes, this.codecs);
    this.widgetRef = uploadcare.Widget('[name="file"]', {
      publicKey: '71eac221885fa40dc817',
      tabs: 'camera',
      videoPreferredMimeTypes: supportedVideos[0],
      previewStep: true,
      imageShrink: '1024x1024',
      cameraMirrorDefault: false,
    });

    this.widgetRef.onUploadComplete((info) => {
      // Handle uploaded file info.
      if (!info.isImage) {
        this.videoURL = info.cdnUrl;
        this.video = true;
      } else if (info.isImage) {
        this.webcamImageURL = info.cdnUrl;
        this.webcamImage = true;
      }
      const url = global.apiRoot + '/course_details/lesson_run/' + this.lessonRunCode + '/upload_document/';
      console.log(info);
      const formData: FormData = new FormData();
      formData.append('document_type', this.video ? 'video' : 'image');
      formData.append('document_url', this.video ? this.videoURL : this.webcamImageURL);
      const headers = new HttpHeaders();
      headers.set('Content-Type', null);
      headers.set('Accept', 'multipart/form-data');
      const params = new HttpParams();
      this.httpClient.post(url, formData, { params, headers }).subscribe(
        (data: IdeaDocument) => {
          console.log(data);
          if (data.document_type === 'video') {
            this.video_id = data.id;
          } else if (data.document_type === 'image') {
            this.webcamImageId = data.id;
          }
        },
        (error) => console.log(error)
      );
    });
  }

  getSupportedMimeTypes(media, types, codecs) {
    console.log(MediaRecorder);
    const isSupported = MediaRecorder.isTypeSupported;
    const supported = [];
    types.forEach((type) => {
      const mimeType = `${media}/${type}`;
      codecs.forEach((codec) =>
        [
          `${mimeType};codecs=${codec}`,
          `${mimeType};codecs:${codec}`,
          `${mimeType};codecs=${codec.toUpperCase()}`,
          `${mimeType};codecs:${codec.toUpperCase()}`,
        ].forEach((variation) => {
          if (isSupported(variation)) {
            supported.push(variation);
          }
        })
      );
      if (isSupported(mimeType)) {
        supported.push(mimeType);
      }
    });
    return supported;
  }

  openDialog() {
    this.widgetRef.openDialog(null, {});
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

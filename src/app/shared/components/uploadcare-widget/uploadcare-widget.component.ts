import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { distinctUntilChanged, skipWhile, switchMap, takeWhile, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { IdeaDocument } from 'src/app/services/backend/schema';
import uploadcare from 'uploadcare-widget';

export type IdeaUserRole = 'owner' | 'viewer';
declare var MediaRecorder: any;
declare var navigator: any;

export interface FileProgress {
  incompleteFileInfo: IncompleteFileInfo;
  cdnUrl: string;
  progress: number;
  state: 'uploading' | 'uploaded' | 'ready';
  uploadProgress: number;
}

export interface IncompleteFileInfo {
  cdnUrl: string;
  cdnUrlModifiers: any;
  isImage: boolean;
  isStored: boolean;
  mimeType: any;
  name: string;
  originalImageInfo: any;
  originalUrl: string;
  size: number;
  sourceInfo: { source: 'camera'; file: Blob };
  uuid: any;
}

export interface ConvertedFile {
  converted_file: string;
  original_file: string;
  token: number;
}

@Component({
  selector: 'benji-uploadcare-widget',
  templateUrl: 'uploadcare-widget.component.html',
})
export class UploadcareWidgetComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() lessonRunCode;
  @Input() icon: string;
  @Input() mediaSelected;
  @Input() tabs: string;
  @Input() uploadDocumentToBenji = true;
  @Input() ucWidgetId;
  @Output() mediaUploaded = new EventEmitter<IdeaDocument | IncompleteFileInfo | any>();
  @Output() mediaUploading = new EventEmitter<FileProgress>();

  widgetRef;
  convertedVideoURL: string;
  originalVideoURL: string;
  video: boolean;
  webcamImageURL: string;
  webcamImage: boolean;
  document: boolean;
  fileType: 'document' | 'video' | 'image';
  fileUrl: string;

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
  @ViewChild('uploadcarewidget') uploadcarewidget;
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    if (!this.icon) {
      this.icon = '/assets/img/idea-creation/cam-upload.svg';
    }
  }

  ngAfterViewInit(): void {
    this.video = false;
    this.webcamImage = false;
    const supportedVideos = this.getSupportedMimeTypes('video', this.videoTypes, this.codecs);
    this.widgetRef = uploadcare.Widget(`[name="${this.tabs}"]`, {
      publicKey: '71eac221885fa40dc817',
      tabs: this.tabs.split('_')[0],
      multiple: false,
      videoPreferredMimeTypes: supportedVideos[0],
      previewStep: true,
      imageShrink: '1024x1024',
      cameraMirrorDefault: false,
    });

    this.widgetRef.onUploadComplete((info: IncompleteFileInfo) => {
      // Handle uploaded file info.

      if (this.checkIfDocument(info)) {
        this.fileType = 'document';
        if (info.name.split('.')[info.name.split('.').length - 1] === 'pdf') {
          this.fileUrl = info.originalUrl;
          this.convertedVideoURL = '';
          this.uploadDocumentUrlToBenji();
        } else {
          const postReq$ = this.convertDocumentFormat(info.uuid);
          postReq$.subscribe((res) => {
            this.fileUrl = res.response.original_file;
            this.convertedVideoURL = res.response.converted_file;
            this.checkDocumentConversionStatus2(res.response.token, 'convert-document', () => {
              this.uploadDocumentUrlToBenji();
            });
          });
        }
      } else if (!info.isImage) {
        // if it's a video
        this.convertVideoFormat('mp4', info.uuid).subscribe(
          (data: ConvertedFile) => {
            this.video = true;
            this.fileType = 'video';
            this.convertedVideoURL = data.converted_file;
            this.originalVideoURL = data.original_file;
            this.fileUrl = data.original_file;
            if (this.uploadDocumentToBenji) {
              // upload to Benji immediately and convert in the background
              this.uploadDocumentUrlToBenji();
            } else {
              this.checkDocumentConversionStatus(data.token, 'convert-video', () => {
                this.mediaUploaded.emit({ isImage: false, isVideo: true, ...data });
              });
            }
          },
          (error) => console.log(error)
        );
      } else if (info.isImage) {
        this.webcamImageURL = info.cdnUrl;
        this.webcamImage = true;
        this.fileType = 'image';
        this.fileUrl = info.cdnUrl;
        if (this.uploadDocumentToBenji) {
          this.uploadDocumentUrlToBenji();
        } else {
          this.mediaUploaded.emit(info);
        }
      }
    });

    this.widgetRef.onChange((widgetObject) => {
      if (widgetObject) {
        widgetObject.promise().progress((info: FileProgress) => {
          this.mediaUploading.emit({
            ...info,
            progress: info.progress * 100,
          });
        });
      }
    });

    this.widgetRef.onDialogOpen((dialog) => {
      dialog.progress((tab) => {
        if (tab === 'camera') {
          this.testCamera();
        } else if (tab === 'file') {
          const buttons: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName(
            'uploadcare--tab__action-button'
          ) as HTMLCollectionOf<HTMLElement>;
          buttons[0].click();
        }
      });
    });
  }

  onVisible(element, callback) {
    new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          callback(element);
          observer.disconnect();
        }
      });
    }).observe(element);
  }

  convertVideoFormat(format: 'mp4', videoUuid: string) {
    const url = global.apiRoot + '/course_details/convert-video/';
    const formData: FormData = new FormData();
    formData.append('video_id', videoUuid);
    const headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    const params = new HttpParams();
    return this.httpClient.post(url, formData, { params, headers });
  }

  convertDocumentFormat(documentId) {
    const url = global.apiRoot + '/course_details/convert-document/';
    return ajax.post(url, { document_id: documentId }, { 'Content-Type': 'application/json' });
  }

  checkDocumentConversionStatus(token: number, check: string, callback?) {
    const url = `${global.apiRoot}/course_details/${check}/status/${token}/`;
    const timer$ = timer(0, 1000);
    timer$
      .pipe(
        switchMap(() => ajax.getJSON(url)),
        takeWhile((res: any) => this.isConversionInProgress(res), true),
        skipWhile((res: any) => this.isConversionInProgress(res))
      )
      .subscribe((res) => {
        if (callback) {
          callback();
        }
      });
  }

  checkDocumentConversionStatus2(token: number, check: string, callback?) {
    const url = `${global.apiRoot}/course_details/${check}/status/${token}/`;
    const timer$ = timer(0, 1000);
    timer$
      .pipe(
        switchMap(() => ajax.getJSON(url)),
        takeWhile((res: any) => this.isConversionInProgress2(res), true),
        skipWhile((res: any) => this.isConversionInProgress2(res))
      )
      .subscribe((res) => {
        if (callback) {
          callback();
        }
      });
  }

  isConversionInProgress(res): boolean {
    return res && res.message === 'We are working on this.';
  }

  isConversionInProgress2(res): boolean {
    console.log(res);
    return res && (res.status === 'pending' || res.status === 'processing');
  }

  uploadDocumentUrlToBenji() {
    const url = global.apiRoot + '/course_details/lesson_run/' + this.lessonRunCode + '/upload_document/';
    const formData: FormData = new FormData();
    formData.append('document_type', this.fileType);
    formData.append('document_url', this.fileUrl);
    formData.append('document_url_converted', this.convertedVideoURL);
    const headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    const params = new HttpParams();
    this.httpClient.post(url, formData, { params, headers }).subscribe(
      (data: IdeaDocument) => {
        this.mediaUploaded.emit(data);
      },
      (error) => console.log(error)
    );
  }

  getSupportedMimeTypes(media, types, codecs) {
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

  ngOnChanges() {}

  testCamera() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    if (!navigator.getUserMedia) {
      alert('Browser doesnt support camera');
    }
    navigator.getUserMedia(
      {
        audio: false,
        video: true,
      },
      (stream) => {
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      },
      () => {
        // on camera error add an element before the button
        const button = document.getElementsByClassName('uploadcare--camera__button_type_retry')[0];
        const message = document.createElement('div');
        message.className =
          message.classList + ' ' + 'camera-not-available uploadcare--text uploadcare--text_size_medium';
        message.innerHTML =
          'If you’re using your camera elsewhere, like Zoom, your computer may need you to go off camera before granting us permissions. ';
        button.insertAdjacentElement('beforebegin', message);

        // change the uploadcare--tab__title title
        const title = document.getElementsByClassName('uploadcare--tab__title')[0];
        title.innerHTML = 'Ooops! Are you using your camera elsewhere?';

        // when video container is visible that means camera is working
        // on camera working hide the error message
        this.onVisible(document.getElementsByClassName('uploadcare--camera__video-container')[0], () => {
          if (document.getElementsByClassName('camera-not-available')[0]) {
            const errorMessage = document.getElementsByClassName('camera-not-available')[0];
            title.innerHTML = 'Photo Booth';
            errorMessage.remove();
          }
        });
      }
    );
  }

  checkIfDocument(info: IncompleteFileInfo): boolean {
    const name = info.name.split('.');
    const fileExtension = name[name.length - 1];
    const extensions = [
      'doc',
      'docx',
      'xls',
      'xlsx',
      'pps',
      'ppsx',
      'ppt',
      'pptx',
      'vsd',
      'vsdx',
      'skw',
      'wpd',
      'wps',
      'xlr',
      'pub',
      'mpp',
      'key',
      'msg',
      'numbers',
      'pages',
      'odt',
      'ods',
      'odp',
      'txt',
      'rtf',
      'pdf',
      'djvu',
      'eml',
      'csv',
      'xps',
      'ps',
      'eps',
      'psd',
      'ai',
    ];

    const exists = extensions.some((el) => fileExtension.includes(el));
    return exists;
  }
}

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
  @Input() mediaSelected;
  @Input() tabs: string;
  @Output() mediaUploaded = new EventEmitter<IdeaDocument>();
  @Output() mediaUploading = new EventEmitter<FileProgress>();

  widgetRef;
  convertedVideoURL: string;
  originalVideoURL: string;
  video: boolean;
  webcamImageURL: string;
  webcamImage: boolean;

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

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.video = false;
    this.webcamImage = false;
    console.log(this.tabs);
    const supportedVideos = this.getSupportedMimeTypes('video', this.videoTypes, this.codecs);
    this.widgetRef = uploadcare.Widget(`[name="${this.tabs}"]`, {
      publicKey: '71eac221885fa40dc817',
      tabs: this.tabs,
      videoPreferredMimeTypes: supportedVideos[0],
      previewStep: true,
      imageShrink: '1024x1024',
      cameraMirrorDefault: false,
    });

    this.widgetRef.onUploadComplete((info: IncompleteFileInfo) => {
      // Handle uploaded file info.
      if (!info.isImage) {
        // now we convert the file
        this.convertVideoFormat('mp4', info.uuid).subscribe(
          (data: ConvertedFile) => {
            this.video = true;
            this.convertedVideoURL = data.converted_file;
            this.originalVideoURL = data.original_file;
            this.uploadDocumentUrlToBenji();
          },
          (error) => console.log(error)
        );
      } else if (info.isImage) {
        this.webcamImageURL = info.cdnUrl;
        this.webcamImage = true;
        this.uploadDocumentUrlToBenji();
      }
    });

    this.widgetRef.onChange((widgetObject) => {
      if (widgetObject) {
        widgetObject.promise().progress((info: FileProgress) => {
          info.progress = info.progress * 100;
          this.mediaUploading.emit(info);
        });
      }
    });

    this.widgetRef.onDialogOpen((dialog) => {
      dialog.progress((tab) => {
        if (tab === 'camera') {
          this.testCamera();
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

  checkVideoConversionStatus(token: number, callback) {
    const url = `${global.apiRoot}/course_details/convert-video/status/${token}/`;
    this.httpClient.get(url).subscribe(
      (res: any) => {
        if (res && res.message === 'Video is converted successfully.') {
          clearInterval(intervalId);
          callback(res);
        }
      },
      (error) => console.log(error)
    );
    const intervalId = window.setInterval(() => {
      /// call your function here
      this.httpClient.get(url).subscribe(
        (res: any) => {
          if (res && res.message === 'Video is converted successfully.') {
            clearInterval(intervalId);
            callback(res);
          }
        },
        (error) => console.log(error)
      );
    }, 1000);
  }

  uploadDocumentUrlToBenji() {
    const url = global.apiRoot + '/course_details/lesson_run/' + this.lessonRunCode + '/upload_document/';
    const formData: FormData = new FormData();
    formData.append('document_type', this.video ? 'video' : 'image');
    formData.append('document_url', this.video ? this.originalVideoURL : this.webcamImageURL);
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
}

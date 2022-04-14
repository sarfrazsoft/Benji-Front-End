import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import * as global from 'src/app/globals';
import { IdeaDocument } from 'src/app/services/backend/schema';
import uploadcare from 'uploadcare-widget';

export type IdeaUserRole = 'owner' | 'viewer';
declare var MediaRecorder: any;

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
@Component({
  selector: 'benji-uploadcare-widget',
  templateUrl: 'uploadcare-widget.component.html',
})
export class UploadcareWidgetComponent implements OnInit, OnChanges {
  @Input() lessonRunCode;
  @Output() mediaUploaded = new EventEmitter<IdeaDocument>();
  @Output() mediaUploading = new EventEmitter<FileProgress>();

  widgetRef;
  videoURL: string;
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

  ngOnInit(): void {
    this.video = false;
    this.webcamImage = false;
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
          this.mediaUploaded.emit(data);
          // if (data.document_type === 'video') {
          //   this.video_id = data.id;
          // } else if (data.document_type === 'image') {
          //   this.webcamImageId = data.id;
          // }
        },
        (error) => console.log(error)
      );
    });

    this.widgetRef.onChange((widgetObject) => {
      console.log(widgetObject);
      if (widgetObject) {
        widgetObject.promise().progress((info: FileProgress) => {
          info.progress = info.progress * 100;
          this.mediaUploading.emit(info);
        });
      }
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

  ngOnChanges() {}
}

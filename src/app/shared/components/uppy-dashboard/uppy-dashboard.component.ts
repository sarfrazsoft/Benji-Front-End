import {
  animate,
  state,
  style,
  transition,
  trigger,
  // ...
} from '@angular/animations';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { UppyConfig } from 'uppy-angular/uppy-angular';
// import { Uppy } from '@uppy/core';
import { SuccessResponse, Uppy } from '@uppy/core';
import GoogleDrive from '@uppy/google-drive';
import Tus from '@uppy/tus';
import Webcam from '@uppy/webcam';
import XHRUpload from '@uppy/xhr-upload';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { ActivitiesService } from 'src/app/services/activities';
import {
  BrainstormSubmitIdeaCommentEvent,
  Category,
  Group,
  Idea,
  IdeaDocument,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation/confirmation.dialog';
import { ImagePickerDialogComponent } from '../../dialogs/image-picker-dialog/image-picker.dialog';

export type IdeaUserRole = 'owner' | 'viewer';

@Component({
  selector: 'benji-uppy-dashboard',
  templateUrl: 'uppy-dashboard.component.html',
})
export class UppyDashboardComponent implements OnInit, OnChanges {
  @Input() lessonRunCode;
  showUppyModal = false;
  @Output() mediaUploaded = new EventEmitter<IdeaDocument>();
  uppy: Uppy = new Uppy({
    id: 'idea-detailed',
    debug: false,
    autoProceed: false,
    restrictions: {
      maxNumberOfFiles: 1,
    },
  });
  // dashboardModalProps = {};

  dashboardModalProps = {
    target: document.body,
    plugins: ['Webcam'],
    onRequestCloseModal: (): void => {
      this.showUppyModal = false;
    },
    proudlyDisplayPoweredByUppy: false,
    maxNumberOfFiles: 1,
  };
  constructor() {}

  ngOnInit(): void {
    this.uppy
      .use(Webcam, { countdown: 3, showRecordingLength: true })
      // .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/' })
      // .use(GoogleDrive, { companionUrl: 'https://companion.uppy.io' })
      .use(XHRUpload, {
        fieldName: 'document',
        // metaFields: [{ document_type: 'video' }],
        endpoint: global.apiRoot + `/course_details/lesson_run/${this.lessonRunCode}/upload_document/`,
        // getResponseData: (res) => {
        //   this.showUppyModal = false;
        //   return res;
        //   // this.videoUploadResponse = res;
        //   // this.mediaUploaded.emit(res);
        // },
      })
      .on('file-added', (file) => {
        console.log(file);
        if (file.type === 'image/jpeg') {
          this.uppy.setFileMeta(file.id, {
            document_type: 'image',
          });
        } else {
          this.uppy.setFileMeta(file.id, {
            document_type: 'video',
          });
        }
      })
      .on('dashboard:modal-open', () => {
        // modal is opened
        // click on camera icon to trigger webcam automatically
        const hh: HTMLElement = document.querySelectorAll<HTMLElement>(
          '[aria-controls="uppy-DashboardContent-panel--Webcam"]'
        )[0];
        hh.click();
      })
      .on('upload-error', (file, error, response) => {
        console.log(file, error, response);
      })
      .on('upload-success', (file, response: SuccessResponse) => {
        this.showUppyModal = false;
        this.mediaUploaded.emit(response.body as IdeaDocument);
      });
  }

  ngOnChanges() {}

  openUppyModal() {
    this.showUppyModal = true;
  }
}

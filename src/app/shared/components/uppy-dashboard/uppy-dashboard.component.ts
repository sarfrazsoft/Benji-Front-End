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
import { Uppy } from '@uppy/core';
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
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation/confirmation.dialog';
import { ImagePickerDialogComponent } from '../../dialogs/image-picker-dialog/image-picker.dialog';
export interface IdeaDetailedInfo {
  showCategoriesDropdown: boolean;
  categories: Array<Category>;
  item: Idea;
  category: Category;
  myGroup: Group;
  activityState: UpdateMessage;
  isMobile: boolean;
  participantCode: number;
  userRole: IdeaUserRole;
}
export type IdeaUserRole = 'owner' | 'viewer';
@Component({
  selector: 'benji-uppy-dashboard',
  templateUrl: 'uppy-dashboard.html',
})
export class UppyDashboardComponent implements OnInit, OnChanges {
  @Input() lessonID;
  showUppyModal = false;
  uppy: Uppy = new Uppy({
    id: 'idea-detailed',
    debug: true,
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
        endpoint: global.apiRoot + `/course_details/lesson_run/${this.lessonID}/upload_document/`,
        getResponseData: (res) => {
          this.showUppyModal = false;
          // this.videoUploadResponse = res;
        },
      })
      .on('file-added', (file) => {
        this.uppy.setFileMeta(file.id, {
          document_type: 'video',
        });
      })
      .on('dashboard:modal-open', () => {
        console.log('Modal is open');
        const hh: HTMLElement = document.querySelectorAll<HTMLElement>(
          '[aria-controls="uppy-DashboardContent-panel--Webcam"]'
        )[0];
        console.log(hh);
        // const ch: HTMLElement = hh.children[0];
        hh.click();
      });
  }

  ngOnChanges() {}

  openUppyModal() {
    this.showUppyModal = true;
  }
}

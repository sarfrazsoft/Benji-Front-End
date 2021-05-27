import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Intercom } from 'ng-intercom';
import { AuthService, ContextService } from 'src/app/services';
import { TeamUser, User } from 'src/app/services/backend/schema';
import {
  JobInfoDialogComponent,
  JoinSessionDialogComponent,
  LaunchSessionDialogComponent,
} from '../../shared';
import { AdminService } from './services/admin.service';

import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { EditorView } from 'prosemirror-view';

import { Validators } from 'ngx-editor';

import doc from './../../shared/ngx-editor/doc';

@Component({
  selector: 'benji-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
  lessons: Array<any> = [];
  editorView: EditorView;

  form = new FormGroup({
    editorContent: new FormControl(doc, Validators.required()),
  });

  get doc(): AbstractControl {
    return this.form.get('editorContent');
  }

  init(view: EditorView): void {
    this.editorView = view;
  }
  constructor(
    public intercom: Intercom,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private contextService: ContextService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.activatedRoute.data.forEach((data: any) => {
      this.lessons = data.dashData.lessons.filter(lesson => lesson.public_permission != 'duplicate');
      
      // if (!data.dashData.user.job_title) {
      //   this.dialog
      //     .open(JobInfoDialogComponent, {
      //       data: {
      //         name: data.dashData.user.first_name
      //       },
      //       disableClose: true,
      //       panelClass: 'dashboard-dialog'
      //     })
      //     .afterClosed()
      //     .subscribe(res => {
      //       console.log(res);
      //     });
      // }
    });
  }

  ngOnInit() {
    localStorage.removeItem('single_user_participant');

    this.authService.startIntercom();
  }
}

// {
//   "titleactivity": {
//     "id": 1253,
//     "next_activity_start_timer": {
//       "id": 549,
//       "status": "running",
//       "start_time": "2021-03-08T13:04:26.229653-05:00",
//       "end_time": "2021-03-08T15:51:06.229653-05:00",
//       "total_seconds": 10000,
//       "remaining_seconds": 9999.859045
//     },
//     "facilitation_status": "running",
//     "auto_next": true,
//     "next_activity_delay_seconds": 10000,
//     "title_image": "emoji://1F642",
//     "main_title": "mainscreen heading text",
//     "title_text": "mainscreen detailed text",
//     "cards": [
//       {
//         "title_image": "emoji://1F642",
//         "main_title": "mainscreen heading text",
//         "title_text": "mainscreen detailed text"
//       }
//     ],
//     "hide_timer": true,
//     "activity_id": "1612207589964",
//     "description": null,
//     "start_time": "2021-03-08T13:04:26.225409-05:00",
//     "end_time": null,
//     "is_paused": false,
//     "run_number": 0,
//     "polymorphic_ctype": 46,
//     "next_activity": 1254,
//     "activity_type": "TitleActivity"
//   }
// }

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
      this.lessons = data.dashData.lessons;
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

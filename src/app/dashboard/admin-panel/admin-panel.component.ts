import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
import { CreateSessionDialogComponent } from 'src/app/shared/dialogs/create-session-dialog/create-session.dialog';

@Component({
  selector: 'benji-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
  lessons: Array<any> = [];
  lessonRuns: Array<any> = [];
  editorView: EditorView;

  adminName = "";

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
    private dialog: MatDialog,
    private router: Router
  ) {
    this.activatedRoute.data.forEach((data: any) => {
      this.lessons = data.dashData.lessons.filter((lesson) => lesson.public_permission !== 'duplicate');

      this.lessonRuns = data.dashData.lessonRuns;
    });
  }

  ngOnInit() {
    localStorage.removeItem('single_user_participant');
    
    this.authService.startIntercom();

    this.adminName = this.contextService.user.first_name;
  }

  openCreateSession() {
    this.dialog.open(CreateSessionDialogComponent, {
      panelClass: 'create-session-dialog'
    })
    .afterClosed()
    .subscribe(data => {
      this.adminService.createNewBoard(data).subscribe((res: any) => {
        this.router.navigate(['/screen/lesson/' + res.lessonrun_code]);
      });
    });
  }

}

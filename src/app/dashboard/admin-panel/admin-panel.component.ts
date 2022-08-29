import { Component, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Intercom } from 'ng-intercom';
import { AuthService, ContextService } from 'src/app/services';
import { TeamUser, User } from 'src/app/services/backend/schema';
import {
  SessionSettingsDialogComponent,
} from '../../shared';
import { AdminService } from './services/admin.service';

import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { EditorView } from 'prosemirror-view';

import { Validators } from 'ngx-editor';

import doc from './../../shared/ngx-editor/doc';
import { LessonGroupService } from 'src/app/services/lesson-group.service';

@Component({
  selector: 'benji-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit, OnChanges {
  lessons: Array<any> = [];
  lessonRuns: Array<any> = [];
  editorView: EditorView;
  layout = 'listLayout';

  adminName = '';
  selectedFolderId: number;
  folderName: string;
  folderLessonsIDs = [];

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
    private router: Router,
    private route: ActivatedRoute,
    private lessonGroupService: LessonGroupService,
  ) {
    this.initDashData();
  }

  ngOnInit() {
    const savedBrandingInfo = JSON.parse(localStorage.getItem('benji_branding'));
    this.contextService.brandingInfo = savedBrandingInfo;

    localStorage.removeItem('single_user_participant');

    this.authService.startIntercom();

    this.adminName = this.contextService.user.first_name;

    this.contextService.selectedFolder$.subscribe((folder) => {
      if (folder === null) {
        this.initDashData();
        this.folderName = null;
      }
      else if (folder) {
        this.selectedFolderId = folder;
        this.lessonGroupService.getFolderDetails(folder)
        .subscribe(
          (folder) => {
            this.folderName = folder.name;
            this.lessons = folder.lesson;
            this.setFolderLessonsIDs();
            this.lessonRuns = [];
            this.activatedRoute.data.forEach((data: any) => {
              data.dashData.lessonRuns.forEach((lessonRun) => {
                this.lessons.forEach((lesson) => {
                  if (lessonRun.lesson.id === lesson.id) {
                    this.lessonRuns.push(lessonRun);
                  } 
                });
              });
            });
          },
          (error) => console.log(error)
        );
      }
    });

  }

  ngOnChanges() {
    this.initDashData();
  }

  initDashData(): void {
    this.activatedRoute.data.forEach((data: any) => {
      this.lessons = data.dashData.lessons.filter((lesson) => lesson.public_permission !== 'duplicate');
      this.lessonRuns = data.dashData.lessonRuns;
    });
  }

  setFolderLessonsIDs() {
    this.folderLessonsIDs = [];
    this.lessons.forEach((lesson) => {
      this.folderLessonsIDs.push(lesson.id);
    });
  }

  openCreateSession() {
    this.dialog
      .open(SessionSettingsDialogComponent, {
        data: {
          createSession: true,
          title: '',
          description: '',
          lessonImage: '',
          imageUrl: '',
        },
        panelClass: 'session-settings-dialog',
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.adminService.createNewBoard(data).subscribe((res: any) => {
            this.adminService
              .addLessonRunImage(
                res.lessonrun_code,
                data.selectedImage,
                data.selectedImageName,
                data.imageUrl
              )
              .subscribe(
                (data) => {
                  console.log(data);
                },
                (error) => console.log(error)
              );
              console.log(res);
              const folderId = this.selectedFolderId;
              this.folderLessonsIDs.push(res.lesson);
              console.log(this.selectedFolderId + " " + this.folderLessonsIDs);
              if (folderId) {
                this.lessonGroupService.updateFolder({ title: this.folderName, lessons: this.folderLessonsIDs, id: folderId })
                .subscribe(
                  (data) => {
                    console.log(data);
                  },
                  (error) => console.log(error)
                );
              }
            // user object was stored when this user logged in.
            // Now we need to store it as host so other modules know who is host
            // for this particular session
            const user: TeamUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('host_' + res.lessonrun_code, JSON.stringify(user));
            this.router.navigate(['/screen/lesson/' + res.lessonrun_code]);
          });
        }
      });
  }

  toggleLayout(type: string) {
    this.layout = type;
  }
}

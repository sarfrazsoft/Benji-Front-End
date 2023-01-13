import { Component, Inject, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Intercom } from 'ng-intercom';
import { AuthService, ContextService } from 'src/app/services';
import { TeamUser, UserSubscription } from 'src/app/services/backend/schema';
import { SessionSettingsDialogComponent, ProPlanDialogComponent } from '../../shared';
import { AdminService } from './services/admin.service';

import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { EditorView } from 'prosemirror-view';

import { Validators } from 'ngx-editor';

import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { LessonGroupService } from 'src/app/services/lesson-group.service';
import { UtilsService } from 'src/app/services/utils.service';
import doc from './../../shared/ngx-editor/doc';

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
  folderLessonsIDs: Array<number> = [];
  userId: number;
  userEmail: string;

  userSubscription: UserSubscription;

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
    private utilsService: UtilsService,
    private lessonGroupService: LessonGroupService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.initDashData();
  }

  ngOnInit() {
    this.utilsService.setDefaultPageTitle();
    const savedBrandingInfo = JSON.parse(localStorage.getItem('benji_branding'));
    this.contextService.brandingInfo = savedBrandingInfo;

    localStorage.removeItem('single_user_participant');

    this.authService.startIntercom();

    this.adminName = this.contextService.user.first_name;
    this.userId = this.contextService.user.id;
    this.userEmail = this.contextService.user.email;
    this.userSubscription = this.contextService.user.user_subscription;

    this.route.queryParams.subscribe((params) => {
      if (params.folder) {
        this.contextService.selectedFolder = params.folder;
      }
    });

    this.contextService.selectedFolder$.subscribe((folderId) => {
      if (folderId === null) {
        this.initDashData();
        this.folderName = null;
      } else if (folderId) {
        this.selectedFolderId = folderId;
        this.lessonGroupService.getFolderDetails(folderId).subscribe(
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
      this.lessonRuns = data.dashData.lessonRuns;
    });
  }

  setFolderLessonsIDs() {
    this.folderLessonsIDs = [];
    this.lessons.forEach((lesson) => {
      this.folderLessonsIDs.push(lesson.id);
    });
  }

  openProPlanDialog() {
    const dialogRef = this.dialog
      .open(ProPlanDialogComponent, {
        disableClose: true,
        panelClass: 'pro-plan-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.document.location.href =
            'https://buy.stripe.com/test_aEU29ucVY47G82AdQQ?prefilled_email=' +
            this.userEmail +
            '&client_reference_id=' +
            this.userId;
        }
      });
  }

  openCreateSession() {
    if (this.lessonRuns.length > 3 && !this.userSubscription?.is_active) {
      this.openProPlanDialog();
    } else {
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
                  (data1) => {
                    console.log(data1);
                  },
                  (error) => console.log(error)
                );
              const folderId = this.selectedFolderId;
              this.folderLessonsIDs.push(res.lesson);
              if (folderId) {
                this.lessonGroupService
                  .updateFolder({ title: this.folderName, lessonsIds: this.folderLessonsIDs, id: folderId })
                  .subscribe(
                    (data2) => {
                      console.log(data2);
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
  }

  toggleLayout(type: string) {
    this.layout = type;
  }

  setLessonRuns(lesRuns: Array<any>) {
    this.activatedRoute.data.forEach((data: any) => {
      // To exclude template lessons
      this.lessons = data.dashData.lessons.filter((lesson) => lesson.public_permission !== 'duplicate');
      data.dashData.lessonRuns = lesRuns;
    });
  }
}

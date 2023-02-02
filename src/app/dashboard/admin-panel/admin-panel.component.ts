import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Intercom } from 'ng-intercom';
import { AuthService, ContextService } from 'src/app/services';

import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { EditorView } from 'prosemirror-view';

import { Validators } from 'ngx-editor';
import { LessonGroupService } from 'src/app/services/lesson-group.service';
import { UtilsService } from 'src/app/services/utils.service';
import doc from './../../shared/ngx-editor/doc';

@Component({
  selector: 'benji-admin-panel',
  templateUrl: './admin-panel.component.html',
})
export class AdminPanelComponent implements OnInit, OnChanges {
  lessons: Array<any> = [];
  lessonRuns: Array<any> = [];
  editorView: EditorView;
  layout = 'listLayout';

  selectedFolderId: number;
  folderName: string;
  folderLessonsIDs: Array<number> = [];

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
    private contextService: ContextService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private lessonGroupService: LessonGroupService,
  ) {
    this.initDashData();
  }

  ngOnInit() {
    this.utilsService.setDefaultPageTitle();
    const savedBrandingInfo = JSON.parse(localStorage.getItem('benji_branding'));
    this.contextService.brandingInfo = savedBrandingInfo;

    localStorage.removeItem('single_user_participant');

    this.authService.startIntercom();

    this.authService.startCello();

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

  toggleLayout(type: string) {
    this.layout = type;
  }

  setLessonRuns(lesRuns: Array<any>) {
    this.lessonRuns = lesRuns;
    this.activatedRoute.data.forEach((data: any) => {
      // To exclude template lessons
      this.lessons = data.dashData.lessons.filter((lesson) => lesson.public_permission !== 'duplicate');
      data.dashData.lessonRuns = lesRuns;
    });
  }
}

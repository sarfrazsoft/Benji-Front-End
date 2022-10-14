import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextService } from 'src/app/services';
import { Lesson, SessionInformation } from 'src/app/services/backend/schema/course_details';
import { AdminService } from '../../admin-panel/services';
import * as global from 'src/app/globals';
import { orderBy, sortBy } from 'lodash';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent, DuplicateSessionDialogComponent, MoveToFolderDialogComponent, SessionSettingsDialogComponent } from 'src/app/shared';
import { LessonInformation } from 'src/app/services/backend/schema';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from 'src/app/services/utils.service';
import { Folder, LessonGroupService, MoveToFolderData } from 'src/app/services/lesson-group.service';
import { LessonListComponent } from './lesson-list/lesson-list.component';
@Component({
  selector: 'benji-lessons-list',
  templateUrl: './lessons.component.html',

})
export class LessonsComponent implements OnInit {
  @ViewChild('lessonList', { static: false }) lessonListComponent: LessonListComponent;
  @Input() lessons: Array<Lesson> = [];
  @Input() lessonRuns: Array<any> = [];
  @Input() isTemplates = false;
  @Input() layout;
  @Output() openCreateSessionEvent = new EventEmitter();
  eventsSubject: Subject<void> = new Subject<void>();
  folderLessonsIDs: Array<number> = [];

  edit(lesson, $event) {
    if (!this.isTemplates) {
      this.eventsSubject.next(lesson);
    }
    $event.stopPropagation();
  }

  constructor(
    private adminService: AdminService,
    private router: Router,
    private http: HttpClient,
    private matDialog: MatDialog,
    private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService,
    private lessonGroupService: LessonGroupService
  ) {}

  ngOnInit() {
    if (this.lessons.length) {
      this.lessons = orderBy(this.lessons, (lesson) => new Date(lesson.last_edited), 'desc');
    }
  }

  openDetails(lesson: Lesson) {
    this.adminService.getLessonDetails(lesson.id).subscribe((res: Lesson) => {
      if (res.lesson_details) {
        this.contextService.lesson = res;
        this.router.navigate(['lesson', lesson.id], {
          relativeTo: this.activatedRoute,
        });
      }
    });
  }

  updateLessons() {
    this.adminService.getLessons().subscribe((lessons) => {
      if (lessons.length) {
        lessons = orderBy(lessons, (lesson) => new Date(lesson.last_edited), 'desc');
      }
      if (this.isTemplates) {
        this.lessons = lessons.filter((lesson) => lesson.public_permission === 'duplicate');
      } else {
        this.lessons = lessons.filter((lesson) => lesson.public_permission !== 'duplicate');
      }
    });
  }

  updateLessonsRuns() {
    this.adminService.getLessonRuns().subscribe((lessonsRuns) => {
      this.lessonRuns = lessonsRuns;
    });
  }

  openCreateSession() {
    this.openCreateSessionEvent.emit();
  }

  deleteSession(val: LessonInformation) {
    const msg = 'Are you sure you want to delete ' + val.lessonTitle + '?';
    const dialogRef = this.matDialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: msg,
        },
        disableClose: true,
        panelClass: 'confirmation-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const request = global.apiRoot + '/course_details/lesson_run/' + val.lessonRunCode + '/';
          this.http.delete(request, {}).subscribe((response) => {
            this.updateLessonsRuns();
          });
          this.utilsService.openSuccessNotification(`Lesson successfully deleted.`, `close`);
          this.lessonRuns = this.lessonRuns.filter((value) => {
            return value.lessonrun_code !== val.lessonRunCode;
          });
        }
      });
  }

  duplicateSession(val: LessonInformation) {
    const dialogRef = this.matDialog
      .open(DuplicateSessionDialogComponent, {
        disableClose: true,
        panelClass: 'confirmation-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res[0] || res[1]) {
          let duplicateDoardIdeas: Boolean;
          res[1] ? (duplicateDoardIdeas = true) : (duplicateDoardIdeas = false);
          let request = global.apiRoot + '/course_details/lesson/' + val.lessonId + '/duplicate-session/';
          this.http.post(request, {}).subscribe((response: SessionInformation) => {
            if (response) {
              request =
                global.apiRoot +
                '/course_details/lesson/' +
                val.lessonId +
                '/duplicate-session/' +
                response.id +
                '/boards/';
              const interval = setInterval(() => {
                // method to be executed;
                this.http
                  .post(request, { duplicate_board_ideas: duplicateDoardIdeas })
                  .subscribe((sessionCreationResponse: any) => {
                    console.log(sessionCreationResponse);
                    if (sessionCreationResponse.detail) {
                      if (sessionCreationResponse.detail.includes('Brainstorm session is not created yet')) {
                      } else if (sessionCreationResponse.detail.includes('Boards are created successfully')) {
                        clearInterval(interval);
                        this.adminService.getLessonRuns().subscribe((lessonsRuns) => {
                          this.lessonRuns = lessonsRuns;
                          // this.getActiveSessions();
                          this.updateLessonsRuns();
                          this.utilsService.openSuccessNotification(
                            `Session successfully duplicated.`,
                            `close`
                          );
                        });
                      }
                    }
                  });
              }, 500);
              // TODO // investigate nested subscribes and 500ms timeout
            } else {
              this.utilsService.openWarningNotification('Something went wrong.', '');
            }
          });
        } else {
          dialogRef.closed;
        }
      });
  }

  openSessionSettings(val: LessonInformation) {
    this.matDialog
      .open(SessionSettingsDialogComponent, {
        data: {
          id: val.lessonId,
          title: val.lessonTitle,
          description: val.lessonDescription,
          lessonImage: val.lessonImage,
          imageUrl: val.imageUrl,
          createSession: false,
        },
        panelClass: 'session-settings-dialog',
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          if (val.index > -1) {
            this.lessonListComponent.updateLessonName(data.lesson_name, val.lessonRunCode);
          }
          this.lessonRuns.find(item => item.lessonrun_code == val.lessonRunCode).lesson.lesson_name = data.lesson_name;
          this.adminService
            .updateLessonRunImage(
              val.lessonRunCode,
              data.lesson_image,
              data.lesson_image_name,
              data.image_url,
              val.lessonId
            )
            .subscribe(
              (data) => {
                this.updateLessonsRuns();
              },
              (error) => console.log(error)
            );
        }
      });
  }

  moveToFolders(val: LessonInformation) {
    this.lessonGroupService.getAllFolders()
      .subscribe(
        (data: Array<Folder>) => {
          this.matDialog
            .open(MoveToFolderDialogComponent, {
              panelClass: 'move-to-folder-dialog',
              data: {
                lessonId: val.lessonId,
                folders: data,
                lessonFolders: val.lessonFolders,
              },
            })
            .afterClosed()
            .subscribe((folders: MoveToFolderData) => {
              if (folders) {
                val.lessonFolders = folders.lessonFolders;
                this.lessonGroupService.bulkUpdateFolders(val.lessonId, folders.lessonFolders).subscribe(
                  (data) => {
                    if (!folders.lessonFolders.includes(this.contextService.selectedFolder)) {
                      //This will cause the currently selected folder to update its lessons list
                      this.contextService.selectedFolder = this.contextService.selectedFolder;
                    }
                  },
                  (error) => console.log(error)
                );
              }
            });
        },
        (error) => console.log(error)
      );
  }

}

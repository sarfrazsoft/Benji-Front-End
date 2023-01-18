import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { orderBy } from 'lodash';
import { Subject } from 'rxjs';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { LessonInformation, NotificationTypes, UserSubscription } from 'src/app/services/backend/schema';
import { Lesson, SessionInformation } from 'src/app/services/backend/schema/course_details';
import { Folder, LessonGroupService, MoveToFolderData } from 'src/app/services/lesson-group.service';
import { UtilsService } from 'src/app/services/utils.service';
import {
  ConfirmationDialogComponent,
  DuplicateSessionDialogComponent,
  MoveToFolderDialogComponent,
  SessionSettingsDialogComponent,
} from 'src/app/shared';
import { AdminService } from '../../admin-panel/services';
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
  @Output() openCreateSession = new EventEmitter();
  @Output() setLessonRuns = new EventEmitter();
  @Output() openProPlanDialog = new EventEmitter();

  eventsSubject: Subject<void> = new Subject<void>();
  folderLessonsIDs: Array<number> = [];
  notificationTypes = NotificationTypes;
  userSubscription: UserSubscription;

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
    this.userSubscription = this.contextService.user.user_subscription;
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

  updateLessonRuns(notify: NotificationTypes) {
    this.adminService.getLessonRuns().subscribe((lessonRuns) => {
      this.lessonRuns = lessonRuns;
      // If inside a folder then the following code with update the folder lessons
      if (this.contextService.selectedFolder) {
        this.setLessonRuns.emit(this.lessonRuns);
        this.resetSelectedFolder();
      }
      if (notify === this.notificationTypes.DELETE) {
        this.setLessonRuns.emit(this.lessonRuns);
        this.utilsService.openSuccessNotification(`Lesson successfully deleted.`, `close`);
      } else if (notify === this.notificationTypes.DUPLICATE) {
        this.setLessonRuns.emit(this.lessonRuns);
        this.utilsService.openSuccessNotification(`Session successfully duplicated.`, `close`);
      }
    });
  }

  openCreateSessionDialog() {
    this.openCreateSession.emit();
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
            if (response) {
              // Get the new list of lessons runs excluded the lesson deleted
              this.updateLessonRuns(this.notificationTypes.DELETE);
            }
          });
          this.lessonRuns = this.lessonRuns.filter((value) => {
            return value.lessonrun_code !== val.lessonRunCode;
          });
        }
      });
  }

  duplicateSession(val: LessonInformation) {
    console.log(this.lessonRuns.length);
    console.log(!this.userSubscription?.is_active);
    console.log(this.lessonRuns.length >= 3 && !this.userSubscription?.is_active);
    if (this.lessonRuns.length >= 3 && !this.userSubscription?.is_active) {
      this.openProPlanDialog.emit();
    } else {
      const dialogRef = this.matDialog
        .open(DuplicateSessionDialogComponent, {
          disableClose: true,
          panelClass: 'confirmation-dialog',
        })
        .afterClosed()
        .subscribe((res) => {
          if (res[0] || res[1]) {
            let duplicateBoardIdeas: Boolean;
            res[1] ? (duplicateBoardIdeas = true) : (duplicateBoardIdeas = false);
            const request = global.apiRoot + '/course_details/lesson/' + val.lessonId + '/duplicate-session/';
            this.http.post(request, {}).subscribe((response: SessionInformation) => {
              if (response) {
                this.duplicateSessionBoards(val.lessonId, response.id, duplicateBoardIdeas);
                this.getAllLessonRuns(response.lesson);
              } else {
                this.utilsService.openWarningNotification('Something went wrong.', '');
              }
            });
          }
        });
    }
  }

  getAllLessonRuns(lessonId: number) {
    const currentFolder = this.contextService.selectedFolder;
    // If inside a folder then first add to folder and then updateLessonRuns from there
    if (currentFolder) {
      this.addToFolder(currentFolder, lessonId);
    } else {
      // if not in a folder
      this.updateLessonRuns(this.notificationTypes.DUPLICATE);
    }
  }

  duplicateSessionBoards(fromLessonId, toLessonId, duplicateBoardIdeas) {
    const request =
      global.apiRoot +
      '/course_details/lesson/' +
      fromLessonId +
      '/duplicate-session/' +
      toLessonId +
      '/boards/';
    const interval = setInterval(() => {
      // TODO // investigate 500ms timeout
      // method to be executed;
      this.http
        .post(request, { duplicate_board_ideas: duplicateBoardIdeas })
        .subscribe((sessionCreationResponse: any) => {
          if (sessionCreationResponse.detail) {
            if (sessionCreationResponse.detail.includes('Brainstorm session is not created yet')) {
            } else if (sessionCreationResponse.detail.includes('Boards are created successfully')) {
              clearInterval(interval);
            }
          }
        });
    }, 500);
  }

  addToFolder(folderId: number, lessonId: number) {
    // First fetch the folder details
    this.lessonGroupService.getFolderDetails(folderId).subscribe((res) => {
      const spacesIds = res.lesson.map((space) => space.id);
      // Then include the lessonId in the above folder
      spacesIds.push(lessonId);
      this.lessonGroupService
        .updateFolder({ id: res.id, title: res.name, lessonsIds: spacesIds })
        .subscribe((res) => {
          if (res) {
            this.updateLessonRuns(this.notificationTypes.DUPLICATE);
          }
        });
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
          this.lessonRuns.find((item) => item.lessonrun_code === val.lessonRunCode).lesson.lesson_name =
            data.lesson_name;
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
                this.updateLessonRuns(this.notificationTypes.NONE);
              },
              (error) => console.log(error)
            );
        }
      });
  }

  moveToFolders(val: LessonInformation) {
    this.lessonGroupService.getAllFolders().subscribe(
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
                    // This will cause the currently selected folder to update its lessons list
                    this.resetSelectedFolder();
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

  resetSelectedFolder() {
    this.contextService.selectedFolder = this.contextService.selectedFolder;
  }
}

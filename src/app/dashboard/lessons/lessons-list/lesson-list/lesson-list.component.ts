import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AdminService } from 'src/app/dashboard/admin-panel';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { Lesson, SessionInformation } from 'src/app/services/backend/schema/course_details';
import { TeamUser } from 'src/app/services/backend/schema/user';
import { LessonGroupService } from 'src/app/services/lesson-group.service';
import { UtilsService } from 'src/app/services/utils.service';
import {
  ConfirmationDialogComponent,
  DuplicateSessionDialogComponent,
  MoveToFolderDialogComponent,
  SessionSettingsDialogComponent,
} from 'src/app/shared/dialogs';
export interface TableRowInformation {
  index: number;
  lessonRunCode: number;
  lesson_title: string;
  host: string;
  lesson_description: string;
  boards: number;
  participants: number;
  startDate: string;
  lessonId: number;
  hostId: number;
  lesson_image_id?: number;
  lesson_image?: string;
  image_url?: string;
}
@Component({
  selector: 'benji-lesson-list',
  templateUrl: './lesson-list.component.html',
})
export class LessonListComponent implements OnInit, OnChanges {
  @Input() lessonRuns: Array<Lesson> = [];
  @Output() updateLessonsRuns = new EventEmitter();

  displayedColumns: string[] = ['title', 'host', 'boards', 'participants', 'startDate', 'options'];
  dataSource: TableRowInformation[] = [];

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  options = [
    {
      option: 'Open',
      icon: '../../../../assets/img/dashboard/open.svg',
    },
    {
      option: 'View only',
      icon: '../../../../assets/img/dashboard/view-only.svg',
    },
    {
      option: 'Closed',
      icon: '../../../../assets/img/dashboard/closed.svg',
    },
  ];

  selectedCategory = 'Open';

  hostname = window.location.host + '/participant/join?link=';
  maxIdIndex: any;
  folderLessonsIDs = [];

  constructor(
    private router: Router,
    private utilsService: UtilsService,
    private matDialog: MatDialog,
    private http: HttpClient,
    private adminService: AdminService,
    private contextService: ContextService,
    private lessonGroupService: LessonGroupService
  ) {}

  ngOnInit() {
    this.getActiveSessions();
  }

  ngOnChanges() {
    this.getActiveSessions();
  }

  getActiveSessions() {
    this.dataSource = [];
    const slicedArray = this.lessonRuns;
    slicedArray.forEach((val: any, index: number) => {
      const ids = val.lessonrun_images.map((object) => {
        return object.id;
      });
      const max = Math.max(...ids);
      this.maxIdIndex = val.lessonrun_images.findIndex((x) => x.id === max);
      this.dataSource.push({
        index: index,
        lessonRunCode: val.lessonrun_code,
        lessonId: val.lesson.id,
        lesson_title: val.lesson.lesson_name,
        lesson_description: val.lesson.lesson_description,
        host: val.host.first_name + ' ' + val.host.last_name,
        hostId: val.host.id,
        boards: val.board_count,
        participants: val.participant_set.length,
        startDate: moment(val.start_time).format('MMM D, YYYY'),
        lesson_image_id: val.lessonrun_images[this.maxIdIndex]?.id,
        lesson_image: val.lessonrun_images[this.maxIdIndex]?.img,
        image_url: val.lessonrun_images[this.maxIdIndex]?.image_url,
      });
    });
  }

  navigateToSession(element: TableRowInformation) {
    const user: TeamUser = JSON.parse(localStorage.getItem('user'));
    if (user.id === element.hostId) {
      localStorage.setItem('host_' + element.lessonRunCode, JSON.stringify(user));
    }
    this.router.navigate(['/screen/lesson/' + element.lessonRunCode], {
      queryParams: {
        folder: null,
      },
      queryParamsHandling: 'merge',
    });
    this.contextService.selectedFolder = null;
  }

  copyLink(val) {
    this.utilsService.copyToClipboard(this.hostname + val.lessonRunCode);
  }

  edit(val: TableRowInformation) {
    this.openSessionSettings(val);
  }

  delete(val: TableRowInformation) {
    const msg = 'Are you sure you want to delete ' + val.lesson_title + '?';
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
            console.log(response);
            this.updateLessonsRuns.emit();
          });
          this.utilsService.openSuccessNotification(`Lesson successfully deleted.`, `close`);
          this.dataSource = this.dataSource.filter((value) => {
            return value.lessonRunCode !== val.lessonRunCode;
          });
        }
      });
  }

  duplicateSession(val: TableRowInformation) {
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
                          this.getActiveSessions();
                          this.updateLessonsRuns.emit();
                          this.utilsService.openSuccessNotification(
                            `Session successfully duplicated.`,
                            `close`
                          );
                        });
                      }
                    }
                  });
              }, 500);

              // this.dataSource = this.dataSource.map((value) => value)
            } else {
              this.utilsService.openWarningNotification('Something went wrong.', '');
            }
          });
        } else {
          dialogRef.closed;
        }
      });
  }

  openSessionSettings(val: TableRowInformation) {
    this.matDialog
      .open(SessionSettingsDialogComponent, {
        data: {
          index: val.index,
          id: val.lessonId,
          title: val.lesson_title,
          description: val.lesson_description,
          lessonImage: val.lesson_image,
          imageUrl: val.image_url,
          createSession: false,
        },
        panelClass: 'session-settings-dialog',
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.dataSource[data.index].lesson_title = data?.lesson_name;
          this.adminService
            .updateLessonRunImage(
              val.lessonRunCode,
              data.lesson_image,
              data.lesson_image_name,
              data.image_url,
              val.lesson_image_id
            )
            .subscribe(
              (data) => {
                this.updateLessonsRuns.emit();
                this.adminService.getLessonRuns().subscribe((lessonsRuns) => {
                  this.lessonRuns = lessonsRuns;
                  this.getActiveSessions();
                });
              },
              (error) => console.log(error)
            );
        }
      });
  }

  moveToFolder(val: TableRowInformation) {
    this.matDialog
      .open(MoveToFolderDialogComponent, {
        panelClass: 'move-to-folder-dialog',
        data: {
          lessonId: val.lessonId,
        },
      })
      .afterClosed()
      .subscribe((folder) => {
        if (folder) {
          this.lessonGroupService.getFolderDetails(folder.id).subscribe((folder) => {
            const lessons = folder.lesson;
            this.folderLessonsIDs = [];
            lessons.forEach((lesson) => {
              this.folderLessonsIDs.push(lesson.id);
            });
            this.folderLessonsIDs.push(val.lessonId);
            const request = folder.title
              ? this.lessonGroupService.createNewFolder({ title: folder.title, lessonId: val.lessonId })
              : this.lessonGroupService.updateFolder({
                  title: folder.name,
                  lessons: this.folderLessonsIDs,
                  id: folder.id,
                });
            request.subscribe(
              (data) => {
                this.contextService.newFolderAdded = true;
                this.lessonGroupService.getAllFolders().subscribe(
                  (data) => {
                    // this.contextService.folders = data;
                  },
                  (error) => console.log(error)
                );
              },
              (error) => console.log(error)
            );
          });
        }
      });
  }
}

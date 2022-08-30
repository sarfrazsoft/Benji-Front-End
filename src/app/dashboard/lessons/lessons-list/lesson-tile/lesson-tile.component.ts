import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
// import { EditorService } from 'src/app/dashboard/editor/services';
import * as global from 'src/app/globals';
import { BackendRestService, ContextService } from 'src/app/services';
import { TeamUser } from 'src/app/services/backend/schema';
import { Lesson, LessonRunDetails, SessionInformation } from 'src/app/services/backend/schema/course_details';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { LessonGroupService } from 'src/app/services/lesson-group.service';
import { UtilsService } from 'src/app/services/utils.service';
import {
  ConfirmationDialogComponent,
  DuplicateSessionDialogComponent,
  MoveToFolderDialogComponent,
  SessionSettingsDialogComponent,
  TemplatesDialogComponent,
} from 'src/app/shared';
import { AdminService } from '../../../admin-panel/services';

@Component({
  selector: 'benji-lesson-tile',
  templateUrl: './lesson-tile.component.html',
})
export class LessonTileComponent implements OnInit {
  @Input() lesson: LessonRunDetails;
  @Input() isTemplates = false;
  @Input() events: Observable<Lesson>;
  @Output() updateLessonsRuns = new EventEmitter();
  private eventsSubscription: Subscription;
  showSettings: boolean;
  dialogRef;
  settingsDialogRef;
  timeStamp: string;
  participantsCount: number;
  coverPhoto: string;

  hostLocation = window.location.host;
  hostname = window.location.host + '/participant/join?link=';
  maxIdIndex: number;
  folderLessonsIDs = [];

  constructor(
    private matDialog: MatDialog,
    private adminService: AdminService,
    private restService: BackendRestService,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService,
    private utilsService: UtilsService,
    private lessonGroupService: LessonGroupService,
  ) {}

  ngOnInit() {
    this.participantsCount = this.lesson.participant_set.length;
    this.setCoverPhoto();
    this.calculateTimeStamp();
    setInterval(() => {
      this.calculateTimeStamp();
    }, 60000);
  }

  setCoverPhoto() {
    if (this.lesson.lessonrun_images.length > 0) {
      const ids = this.lesson.lessonrun_images.map((object) => object.id);
      const max = Math.max(...ids);
      this.maxIdIndex = this.lesson.lessonrun_images.findIndex((x) => x.id === max);

      const image_url = this.lesson.lessonrun_images[this.maxIdIndex]?.image_url;
      const img = this.lesson.lessonrun_images[this.maxIdIndex]?.img;

      if (!image_url && !img) {
        this.setDefaultCoverPhoto();
        return;
      }

      this.coverPhoto = image_url ?? img;
    } else {
      this.setDefaultCoverPhoto();
    }
  }

  setDefaultCoverPhoto() {
    this.coverPhoto = 'assets/img/temporary/dummy.png';
  }

  calculateTimeStamp() {
    // Test string
    // this.timeStamp = moment('Thu May 09 2022 17:32:03 GMT+0500').fromNow().toString();
    // this.timeStamp = moment('Thu Oct 25 1881 17:30:03 GMT+0300').fromNow().toString();
    // console.log(this.lesson.lesson.creation_time);
    this.timeStamp = moment(this.lesson.lesson.creation_time).fromNow().toString();
    if (this.timeStamp === 'a few seconds ago' || this.timeStamp === 'in a few seconds') {
      this.timeStamp = '1m ago';
    } else if (this.timeStamp.includes('an hour ago')) {
      this.timeStamp = '1hr ago';
    } else if (this.timeStamp.includes('a minute ago')) {
      this.timeStamp = '1m ago';
    } else if (this.timeStamp.includes('minutes')) {
      this.timeStamp = this.timeStamp.replace(/\sminutes/, 'm');
    } else if (this.timeStamp.includes('hours')) {
      this.timeStamp = this.timeStamp.replace(/\shours/, 'hr');
    } else if (this.timeStamp.includes('days')) {
      this.timeStamp = this.timeStamp.replace(/\sdays/, 'd');
    } else if (this.timeStamp.includes('a month')) {
      this.timeStamp = this.timeStamp.replace(/a month/, '1mo');
    } else if (this.timeStamp.includes('months')) {
      this.timeStamp = this.timeStamp.replace(/\smonths/, 'mo');
    } else if (this.timeStamp.includes('a year')) {
      this.timeStamp = this.timeStamp.replace(/a year/, '1yr');
    } else if (this.timeStamp.includes('years')) {
      this.timeStamp = this.timeStamp.replace(/\syears/, 'yr');
    }
  }

  navigateToSession() {
    const user: TeamUser = JSON.parse(localStorage.getItem('user'));
    if (user.id === this.lesson.host.id) {
      localStorage.setItem('host_' + this.lesson.lessonrun_code, JSON.stringify(user));
    }
    this.router.navigate(['/screen/lesson/' + this.lesson.lessonrun_code]);
    this.contextService.selectedFolder = null;
  }

  copyLink(val) {
    this.utilsService.copyToClipboard(this.hostname + val.lessonRunCode);
  }

  edit() {
    this.openSessionSettings();
  }

  delete() {
    const msg = 'Are you sure you want to delete ' + this.lesson.lesson.lesson_name + '?';
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
          const request = global.apiRoot + '/course_details/lesson_run/' + this.lesson.lessonrun_code + '/';
          this.http.delete(request, {}).subscribe((response) => {
            console.log(response);
            this.updateLessonsRuns.emit();
          });
          this.utilsService.openSuccessNotification(`Lesson successfully deleted.`, `close`);
        }
      });
  }

  duplicateSession() {
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
          let request =
            global.apiRoot + '/course_details/lesson/' + this.lesson.lesson.id + '/duplicate-session/';
          this.http.post(request, {}).subscribe((response: SessionInformation) => {
            if (response) {
              request =
                global.apiRoot +
                '/course_details/lesson/' +
                this.lesson.lesson.id +
                '/duplicate-session/' +
                response.id +
                '/boards/';
              const interval = setInterval(() => {
                // method to be executed;
                this.http
                  .post(request, { duplicate_board_ideas: duplicateDoardIdeas })
                  .subscribe((sessionCreationResponse: any) => {
                    if (sessionCreationResponse.detail) {
                      if (sessionCreationResponse.detail.includes('Brainstorm session is not created yet')) {
                      } else if (sessionCreationResponse.detail.includes('Boards are created successfully')) {
                        clearInterval(interval);
                        this.adminService.getLessonRuns().subscribe((lessonsRuns) => {
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

  openSessionSettings() {
    this.matDialog
      .open(SessionSettingsDialogComponent, {
        data: {
          id: this.lesson.lesson.id,
          title: this.lesson.lesson.lesson_name,
          description: this.lesson.lesson.lesson_description,
          lessonImage: this.lesson.lessonrun_images[this.maxIdIndex]?.img,
          imageUrl: this.lesson.lessonrun_images[this.maxIdIndex]?.image_url,
          createSession: false,
        },
        panelClass: 'session-settings-dialog',
      })
      .afterClosed()
      .subscribe((data) => {
        if (data?.lesson_image || data?.image_url) {
          if (this.lesson.lessonrun_images[this.maxIdIndex]?.lesson_image_id) {
            this.adminService
              .updateLessonRunImage(
                this.lesson.lessonrun_code,
                data.lesson_image,
                data.lesson_image_name,
                data.image_url,
                this.lesson.lessonrun_images[this.maxIdIndex]
              )
              .subscribe(
                (data) => {
                  console.log(data);
                  this.updateLessonsRuns.emit();
                },
                (error) => console.log(error)
              );
          } else {
            this.adminService
              .addLessonRunImage(
                this.lesson.lessonrun_code,
                data.lesson_image,
                data.lesson_image_name,
                data.image_url
              )
              .subscribe(
                (data) => {
                  console.log(data);
                  this.updateLessonsRuns.emit();
                },
                (error) => console.log(error)
              );
          }
        }
      });
  }
  
  moveToFolder() {
    this.matDialog
      .open(MoveToFolderDialogComponent, {
        panelClass: 'move-to-folder-dialog',
        data: {
          lessonId: this.lesson.id
        }
      })
      .afterClosed()
      .subscribe((folder) => {
        if (folder) {
          this.lessonGroupService.getFolderDetails(folder.id)
          .subscribe(
            (folder) => {
              const lessons = folder.lesson;
              this.folderLessonsIDs = [];
              lessons.forEach((lesson) => {
                this.folderLessonsIDs.push(lesson.id);
              });
              this.folderLessonsIDs.push(this.lesson.id);
              let request = folder.title ? 
                              this.lessonGroupService.createNewFolder({title: folder.title, lessonId: this.lesson.id}) : 
                              this.lessonGroupService.updateFolder({title: folder.name, lessons: this.folderLessonsIDs, id: folder.id});
              request.subscribe(
                (data) => {
                  this.contextService.newFolderAdded = true;
                  this.lessonGroupService.getAllFolders().subscribe(
                    (data) => {
                      //this.contextService.folders = data;
                    },
                    (error) => console.log(error)
                  );
                },
                (error) => console.log(error)
              );
            }
          );
        }
      });
  }

}

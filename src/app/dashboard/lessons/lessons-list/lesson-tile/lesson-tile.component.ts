import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
// import { EditorService } from 'src/app/dashboard/editor/services';
import * as global from 'src/app/globals';
import { BackendRestService, ContextService } from 'src/app/services';
import { Lesson, LessonRunDetails, SessionInformation } from 'src/app/services/backend/schema/course_details';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { UtilsService } from 'src/app/services/utils.service';
import {
  ConfirmationDialogComponent,
  DuplicateSessionDialogComponent,
  SessionSettingsDialogComponent,
  TemplatesDialogComponent,
} from 'src/app/shared';
import { AdminService } from '../../../admin-panel/services';
import * as moment from 'moment';
import { TeamUser } from 'src/app/services/backend/schema';
import { HttpClient } from '@angular/common/http';

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
  // launchSessionLabel = '';
  // rightLaunchArrow = '';
  // rightCaret = '';
  dialogRef;
  // imgSrc = '/assets/img/imageUploadIcon.svg';

  // description = '';
  // showPlaceholder = true;
  settingsDialogRef;
  timeStamp: string;
  participantsCount: number;

  hostname = window.location.host + '/participant/join?link=';

  constructor(
    private matDialog: MatDialog,
    private adminService: AdminService,
    private restService: BackendRestService,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    console.log(this.lesson);
    this.participantsCount = this.lesson.participant_set.length;
    //this.eventsSubscription = this.events.subscribe((lesson) => this.edit());

    // this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
    //   if (info) {
    //     this.launchSessionLabel = info.parameters.launchSession;
    //     this.rightCaret = info.parameters.rightCaret;
    //     this.rightLaunchArrow = info.parameters.rightLaunchArrow;
    //   }
    // });

    this.calculateTimeStamp();
    setInterval(() => {
      this.calculateTimeStamp();
    }, 60000);
  }

  calculateTimeStamp() {
    // Test string
    // this.timeStamp = moment('Thu May 09 2022 17:32:03 GMT+0500').fromNow().toString();
    // this.timeStamp = moment('Thu Oct 25 1881 17:30:03 GMT+0300').fromNow().toString();
    //console.log(this.lesson.lesson.creation_time);
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
            console.log(response)
            this.updateLessonsRuns.emit();
          });
          this.utilsService.openSuccessNotification(`Lesson successfully deleted.`, `close`);
          // this.dataSource = this.dataSource.filter((value) => {
          //   return value.lessonRunCode !== val.lessonRunCode;
          // });
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
          let request = global.apiRoot + '/course_details/lesson/' + this.lesson.lesson.id + '/duplicate-session/';
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
                    console.log(sessionCreationResponse);
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
          createSession: false,
        },
        panelClass: 'session-settings-dialog',
      })
      .afterClosed()
      .subscribe((data) => {
        this.updateLessonsRuns.emit();
      });
  }

  // showSettingsModal() {
  //   this.settingsDialogRef = this.dialog
  //     .open(SessionSettingsDialogComponent, {
  //       data: {
  //         id: this.lesson.lesson.id,
  //         title: this.lesson.lesson.lesson_name,
  //         description: this.lesson.lesson.lesson_description,
  //         featureImage: this.lesson.lesson.feature_image,
  //       },
  //       disableClose: false,
  //       panelClass: ['dashboard-dialog', 'editor-lesson-settings-dialog'],
  //     })
  //     .afterClosed()
  //     .subscribe((res) => {
  //       if (res) {
  //         this.lesson.lesson.lesson_name = res.lesson_name;
  //         this.lesson.lesson.lesson_description = res.lesson_description;
  //         this.lesson.lesson.feature_image = res.feature_image;
  //       }
  //     });
  // }

  // launchSession(event, lesson): void {
  //   // if it's a single user lesson
  //   this.restService.start_lesson(lesson.id).subscribe(
  //     (lessonRun) => {
  //       if (lesson.single_user_lesson) {
  //         setTimeout(() => {
  //           this.router.navigate(['/user/lesson/' + lessonRun.lessonrun_code]);
  //         }, 1500);
  //       } else {
  //         this.router.navigate(['/screen/lesson/' + lessonRun.lessonrun_code]);
  //       }
  //     },
  //     (err) => console.log(err)
  //   );
  //   event.stopPropagation();
  // }

  // edit(lesson: Lesson, $event?) {
  //   if (lesson.id) {
  //     if (lesson.effective_permission === 'admin' || lesson.effective_permission === 'edit') {
  //       this.router.navigate(['editor', lesson.id], {
  //         relativeTo: this.activatedRoute,
  //       });
  //     } else {
  //       this.utilsService.openWarningNotification(`You don't have sufficient permissions.`, '');
  //     }
  //   }
  //   if ($event) {
  //     $event.stopPropagation();
  //   }
  // }

  // duplicate(lesson: Lesson, $event?) {
  //   if (lesson.id) {
  //     this.adminService.duplicateLesson(lesson.id).subscribe(
  //       (res) => {
  //         if (res.id) {
  //           this.updateLessons.emit();
  //           this.utilsService.openSuccessNotification(`Lesson successfully duplicated.`, `close`);
  //         }
  //       },
  //       (error) => {
  //         this.utilsService.openWarningNotification('Something went wrong.', '');
  //       }
  //     );
  //   }
  // }

  // delete($event, lesson: Lesson) {
  //   if (lesson.id) {
  //     if (lesson.effective_permission === 'admin') {
  //       const msg = 'Are you sure you want to delete ' + lesson.lesson_name + '?';
  //       this.dialogRef = this.dialog
  //         .open(ConfirmationDialogComponent, {
  //           data: {
  //             confirmationMessage: msg,
  //           },
  //           disableClose: true,
  //           panelClass: 'confirmation-dialog',
  //         })
  //         .afterClosed()
  //         .subscribe((res) => {
  //           if (res) {
  //             this.adminService.deleteLesson(lesson.id).subscribe(
  //               (delRes) => {
  //                 if (delRes.success) {
  //                   this.updateLessons.emit();
  //                   this.utilsService.openSuccessNotification(`Lesson successfully deleted.`, `close`);
  //                 }
  //               },
  //               (error) => {
  //                 this.utilsService.openWarningNotification('Something went wrong.', '');
  //               }
  //             );
  //           }
  //         });
  //     } else {
  //       this.utilsService.openWarningNotification(
  //         `You don't have sufficient permission to perform this action.`,
  //         ''
  //       );
  //     }
  //   }
  //   $event.stopPropagation();
  // }

  // editDescription($event, lesson: Lesson) {
  //   this.description = lesson.lesson_description;
  // }

  // saveDescription($event) {
  //   $event.preventDefault();
  //   $event.stopPropagation();

  //   const l: Lesson = {
  //     id: this.lesson.id,
  //     lesson_name: this.lesson.lesson.lesson_name,
  //     lesson_description: this.description,
  //   };
  //   this.adminService
  //     .updateLesson(l, this.lesson.id)
  //     .pipe(
  //       map((res) => res),
  //       catchError((error) => error)
  //     )
  //     .subscribe((res: Lesson) => {
  //       this.lesson.lesson.lesson_description = res.lesson_description;
  //     });
  // }

}

import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AdminService } from 'src/app/dashboard/admin-panel';
import * as global from 'src/app/globals';
import { Lesson, SessionInformation } from 'src/app/services/backend/schema/course_details';
import { TeamUser } from 'src/app/services/backend/schema/user';
import { UtilsService } from 'src/app/services/utils.service';
import { ConfirmationDialogComponent, SessionSettingsDialogComponent } from 'src/app/shared/dialogs';
export interface TableRowInformation {
  index: number;
  lessonRunCode: number;
  lesson_title: string;
  host: string;
  lesson_description: string;
  participants: number;
  startDate: string;
  lessonId: number;
  hostId: number;
}
@Component({
  selector: 'benji-active-lessons',
  templateUrl: './active-lessons.component.html',
})
export class ActiveLessonsComponent implements OnInit {
  @Input() lessonRuns: Array<Lesson> = [];

  displayedColumns: string[] = ['title', 'host', 'participants', 'startDate', 'options'];
  dataSource: TableRowInformation[] = [];

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  options = [
    {
      option: 'Open',
      icon: '../../../../assets/img/dashboard-active-sessions/open.svg',
    },
    {
      option: 'View only',
      icon: '../../../../assets/img/dashboard-active-sessions/view-only.svg',
    },
    {
      option: 'Closed',
      icon: '../../../../assets/img/dashboard-active-sessions/closed.svg',
    },
  ];

  selectedCategory = 'Open';

  hostname = window.location.host + '/participant/join?link=';

  constructor(
    private router: Router,
    private utilsService: UtilsService,
    private matDialog: MatDialog,
    private http: HttpClient,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.getActiveSessions();
  }

  getActiveSessions() {
    this.dataSource = [];
    const slicedArray = this.lessonRuns;
    slicedArray.forEach((val: any, index: number) => {
      this.dataSource.push({
        index: index,
        lessonRunCode: val.lessonrun_code,
        lessonId: val.lesson.id,
        lesson_title: val.lesson.lesson_name,
        lesson_description: val.lesson.lesson_description,
        host: val.host.first_name + ' ' + val.host.last_name,
        hostId: val.host.id,
        participants: val.participant_set.length,
        startDate: moment(val.start_time).format('MMM D, YYYY'),
      });
    });
  }

  navigateToSession(element: TableRowInformation) {
    const user: TeamUser = JSON.parse(localStorage.getItem('user'));
    if (user.id === element.hostId) {
      localStorage.setItem('host_' + element.lessonRunCode, JSON.stringify(user));
    }
    this.router.navigate(['/screen/lesson/' + element.lessonRunCode]);
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
          this.http.delete(request, {}).subscribe((response) => console.log(response));
          this.utilsService.openSuccessNotification(`Lesson successfully deleted.`, `close`);
          this.dataSource = this.dataSource.filter((value) => {
            return value.lessonRunCode !== val.lessonRunCode;
          });
        }
      });
  }

  duplicateSession(val: TableRowInformation) {
    const msg = 'Do you want to duplicate board(s) ideas for this session as well?';
    const dialogRef = this.matDialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: msg,
          actionButton: 'Yes',
          cancelButton: 'No',
        },
        disableClose: true,
        panelClass: 'confirmation-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        let duplicateBoardIdeas: Boolean;
        res ? (duplicateBoardIdeas = true) : (duplicateBoardIdeas = false);
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
              this.http.post(request, { duplicateBoardIdeas }).subscribe((sessionCreationResponse: any) => {
                console.log(sessionCreationResponse);
                if (sessionCreationResponse.detail) {
                  if (sessionCreationResponse.detail.includes('Brainstorm session is not created yet')) {
                  } else if (sessionCreationResponse.detail.includes('Boards are created successfully')) {
                    this.adminService.getLessonRuns().subscribe((lessonsRuns) => {
                      this.lessonRuns = lessonsRuns;
                      this.getActiveSessions();
                      clearInterval(interval);
                      this.utilsService.openSuccessNotification(`Session successfully duplicated.`, `close`);
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
          createSession: false,
        },
        panelClass: 'session-settings-dialog',
      })
      .afterClosed()
      .subscribe((data) => {
        this.dataSource[data.index].lesson_title = data.lesson_name;
      });
  }
}

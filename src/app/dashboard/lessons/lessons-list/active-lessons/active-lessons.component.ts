import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { UtilsService } from 'src/app/services/utils.service';
import { SessionSettingsDialogComponent } from 'src/app/shared/dialogs';

export interface TableRowInformation {
  index: number;
  lessonRunCode: number;
  lesson_title: string;
  host: string;
  lesson_description: string;
  participants: number;
  startDate: string;
  lessonId: number;
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

  constructor(private router: Router, private utilsService: UtilsService, private matDialog: MatDialog) {}

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
        participants: val.participant_set.length,
        startDate: moment(val.start_time).format('MMM D, YYYY'),
      });
    });
  }

  navigateToSession(element) {
    this.router.navigate(['/screen/lesson/' + element.lessonRunCode]);
  }

  copyLink(val) {
    this.utilsService.copyToClipboard(this.hostname + val.lessonRunCode);
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

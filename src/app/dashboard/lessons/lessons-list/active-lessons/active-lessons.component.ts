import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import * as moment from 'moment';
import { UtilsService } from 'src/app/services/utils.service';

export interface PeriodicElement {
  lessonRunCode: number;
  title: string;
  host: string;
  participants: number;
  startDate: string;
  //endDate: string;
}

@Component({
  selector: 'benji-active-lessons',
  templateUrl: './active-lessons.component.html',
})
export class ActiveLessonsComponent implements OnInit {

  @Input() lessonRuns: Array<Lesson> = [];

  //displayedColumns: string[] = ['title', 'host', 'participants', 'startDate', 'endDate', 'options'];
  displayedColumns: string[] = ['title', 'host', 'participants', 'startDate', 'options'];
  dataSource: PeriodicElement[] = [];

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  options = [
    {
      option: 'Open',
      icon: '../../../../assets/img/dashboard-active-sessions/open.svg'
    },
    {
      option: 'View only',
      icon: '../../../../assets/img/dashboard-active-sessions/view-only.svg'
    },
    {
      option: 'Closed',
      icon: '../../../../assets/img/dashboard-active-sessions/closed.svg'
    },
  ]

  selectedCategory = 'Open';

  hostname = window.location.host + '/participant/join?link=';

  constructor(
    private router: Router,
    private utilsService: UtilsService,
  ) {}

  ngOnInit() {
    this.getActiveSessions();
  }

  getActiveSessions() {
    this.dataSource = [];
    console.log(this.lessonRuns);
    const slicedArray = this.lessonRuns;
    slicedArray.forEach((val: any) => {
      this.dataSource.push(
        {
          lessonRunCode: val.lessonrun_code, 
          title: val.lesson.lesson_name, 
          host:  val.host.first_name + ' ' + val.host.last_name, 
          participants: val.participant_set.length, 
          startDate: moment(val.start_time).format('MMM D, YYYY'),
         // endDate: val.end_time ? moment(val.end_time).format('MMM D, YYYY') : ''
        })
    });
  }

  navigateToSession(element) {
    this.router.navigate(['/screen/lesson/' + element.lessonRunCode]);
  }

  copyLink(val) {
    this.utilsService.copyToClipboard(this.hostname + val.lessonRunCode);
  }

  openSessionSettings(val ) {}
  //   this.matDialog
  //     .open(SessionSettingsDialogComponent, {
  //       data: {
  //         id: this.lesson.id,
  //         title: this.lesson.lesson_name,
  //         description: this.lesson.lesson_description,
  //         Create: false,
  //       },
  //       panelClass: 'session-settings-dialog',
  //     })
  //     .afterClosed()
  //     .subscribe((data) => {
  //       this.socketMessage.emit(new GetUpdatedLessonDetailEvent());
  //     });
  // }
}

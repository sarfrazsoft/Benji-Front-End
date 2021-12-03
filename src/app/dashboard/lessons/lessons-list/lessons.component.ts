import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextService } from 'src/app/services';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { AdminService } from '../../admin-panel/services';

import { orderBy, sortBy } from 'lodash';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';
import { UtilsService } from 'src/app/services/utils.service';

export interface PeriodicElement {
  lessonRunCode: number;
  title: string;
  host: string;
  participants: number;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'benji-lessons-list',
  templateUrl: './lessons.component.html',
})
export class LessonsComponent implements OnInit {
  @Input() lessons: Array<Lesson> = [];
  @Input() lessonRuns: Array<Lesson> = [];
  @Input() isTemplates = false;

  eventsSubject: Subject<void> = new Subject<void>();

  displayedColumns: string[] = ['title', 'host', 'participants', 'startDate', 'endDate', 'options'];
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

  edit(lesson, $event) {
    if (!this.isTemplates) {
      this.eventsSubject.next(lesson);
    }
    $event.stopPropagation();
  }

  constructor(
    private adminService: AdminService,
    private router: Router,
    private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService
  ) {}

  ngOnInit() {
    if (this.lessons.length) {
      this.lessons = orderBy(this.lessons, (lesson) => new Date(lesson.last_edited), 'desc');
    }
    this.getActiveSessions();
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

  getActiveSessions() {
    this.dataSource = [];
    const slicedArray = this.lessonRuns.slice(0, 5);
    slicedArray.forEach((val: any) => {
      let startDate = new Date(val.start_time);
      let endDate = new Date(val.end_time);
      this.dataSource.push(
        {
          lessonRunCode: val.lessonrun_code, 
          title: val.lesson.lesson_name, 
          host:  val.host.first_name + ' ' + val.host.last_name, 
          participants: val.participant_set.length, 
          startDate: this.months[startDate.getMonth()] +' '+ startDate.getDate().toString() +', '+ startDate.getFullYear(),
          endDate: this.months[endDate.getMonth()] +' '+ endDate.getDate().toString() +', '+ endDate.getFullYear(),
        })
    });
  }

  navigateToSession(element) {
    this.router.navigate(['/screen/lesson/' + element.lessonRunCode]);
  }

  copyLink(val) {
    this.utilsService.copyToClipboard(this.hostname + val.lessonRunCode);
  }
}

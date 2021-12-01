import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextService } from 'src/app/services';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { AdminService } from '../../admin-panel/services';

import { orderBy, sortBy } from 'lodash';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';

export interface PeriodicElement {
  title: string;
  host: string;
  participants: number;
  startDate: string;
  endDate: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  // {title: 'Pitch Perfect', host: 'Matt Parson', participants: 3, startDate: 'Jan 12, 2021', endDate: 'Jan 22, 2021'},
  // {title: 'Negotiations ', host: 'Matt Parson', participants: 3, startDate: 'Jan 12, 2021', endDate: 'Jan 22, 2021'},
  // {title: 'The art of saying no', host: 'Matt Parson', participants: 3, startDate: 'Jan 12, 2021', endDate: 'Jan 22, 2021'},
  // {title: 'How to do more with less', host: 'Matt Parson', participants: 3, startDate: 'Jan 12, 2021', endDate: 'Jan 22, 2021'},
];

@Component({
  selector: 'benji-lessons-list',
  templateUrl: './lessons.component.html',
})
export class LessonsComponent implements OnInit {
  @Input() lessons: Array<Lesson> = [];
  @Input() lessonRuns: Array<Lesson> = [];
  @Input() isTemplates = false;

  eventsSubject: Subject<void> = new Subject<void>();

  displayedColumns: string[] = ['title', 'host', 'participants', 'startDate', 'endDate'];
  dataSource = ELEMENT_DATA;

  edit(lesson, $event) {
    if (!this.isTemplates) {
      this.eventsSubject.next(lesson);
    }
    $event.stopPropagation();
  }

  constructor(
    private adminService: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService
  ) {}

  ngOnInit() {
    if (this.lessons.length) {
      this.lessons = orderBy(this.lessons, (lesson) => new Date(lesson.last_edited), 'desc');
    }

    console.log(this.lessonRuns );

    this.lessonRuns.forEach((val: any) => {
      this.dataSource.push(
        { title: val.lesson.lesson_name, 
          host:  val.host.first_name + ' ' + val.host.last_name, 
          participants: val.participant_set.length, 
          startDate: val.start_time, 
          endDate: val.end_time
        })
    });
  }

  openDetails(lesson: Lesson) {
    // this.router.navigate(['lesson', lesson.id], {
    //   relativeTo: this.activatedRoute,
    // });
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
}

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextService } from 'src/app/services';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { AdminService } from '../../admin-panel/services';

import { orderBy, sortBy } from 'lodash';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
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

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
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

    console.log(this.lessonRuns);
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

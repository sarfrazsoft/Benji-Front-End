import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextService } from 'src/app/services';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { AdminService } from '../../admin-panel/services';

import { orderBy, sortBy } from 'lodash';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'benji-lessons-list',
  templateUrl: './lessons.component.html',
})
export class LessonsComponent implements OnInit {
  @Input() lessons: Array<Lesson> = [];
  @Input() lessonRuns: Array<Lesson> = [];
  @Input() isTemplates = false;

  eventsSubject: Subject<void> = new Subject<void>();

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
      this.lessons = this.lessons.slice(0, 3);
    }
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
}

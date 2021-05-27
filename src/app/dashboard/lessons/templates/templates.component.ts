import { Component, Input, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextService } from 'src/app/services';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { AdminService } from '../../admin-panel/services';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { orderBy, sortBy } from 'lodash';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'benji-templates-list',
  templateUrl: './templates.component.html',
})
export class TemplatesComponent implements OnInit {
  lessons: Array<Lesson> = [];

  eventsSubject: Subject<void> = new Subject<void>();

  edit(lesson, $event) {
    this.eventsSubject.next(lesson);
    $event.stopPropagation();
  }

  constructor(
    private adminService: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService
  ) {
    this.activatedRoute.data.forEach((data: any) => {
      this.lessons = data.dashData.lessons.filter(lesson => lesson.public_permission === 'duplicate');

      // if (!data.dashData.user.job_title) {
      //   this.dialog
      //     .open(JobInfoDialogComponent, {
      //       data: {
      //         name: data.dashData.user.first_name
      //       },
      //       disableClose: true,
      //       panelClass: 'dashboard-dialog'
      //     })
      //     .afterClosed()
      //     .subscribe(res => {
      //       console.log(res);
      //     });
      // }
    });
  }

  ngOnInit() {
    if (this.lessons.length) {
      this.lessons = orderBy(this.lessons, (lesson) => new Date(lesson.last_edited), 'desc');
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
      this.lessons = lessons;
    });
  }
}

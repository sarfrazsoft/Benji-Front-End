import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextService } from 'src/app/services';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { AdminService } from '../../admin-panel/services';

@Component({
  selector: 'benji-lessons-list',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss'],
})
export class LessonsComponent implements OnInit {
  @Input() lessons: Array<any> = [];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService
  ) {}

  ngOnInit() {
    if (this.lessons.length) {
      this.lessons = this.lessons.sort((a, b) => b.id - a.id);
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
        lessons = lessons.sort((a, b) => b.id - a.id);
      }
      this.lessons = lessons;
    });
  }
}

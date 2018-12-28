import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BackendRestService } from '../../../services/backend/backend-rest.service';
import { AuthService } from '../../../services/auth/auth.service';

import { CourseRun} from '../../../services/backend/schema/course_details';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: [
    './landing.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class LandingComponent implements OnInit {
  constructor(private restService: BackendRestService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  loginAndStart(courseID) {
    this.auth
      .login('sean', 'test')
      .subscribe(
        null,
        err => console.error(`Error on authentication: ${err}`),
        () => this.startCourseRun(courseID)
      );
  }

  startCourseRun(courseID) {
    this.restService.create_courserun(courseID).subscribe(
      (courseRun) => this.startLesson(courseRun),
      err => console.error(`Error creating a new course run: ${err}`)
    );

  }

  startLesson(courseRun: CourseRun) {
    this.restService.start_lesson(courseRun.id, 1).subscribe(
      (lessonRun) => this.router.navigate(['/screen/lesson/' + lessonRun.lessonrun_code]),
      err => console.log(err)
    );
  }
}

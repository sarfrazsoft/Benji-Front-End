import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BackendRestService } from '../../../services/backend/backend-rest.service';
import { AuthService } from '../../../services/auth/auth.service';

import { CourseRun } from '../../../services/backend/schema/course_details';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingComponent {
  constructor(
    private restService: BackendRestService,
    private auth: AuthService,
    private router: Router
  ) {}

  loginAndStart(lessonID) {
    this.auth
      .login('matt', 'test')
      .subscribe(
        null,
        err => console.error(`Error on authentication: ${err}`),
        () => this.startLesson(lessonID)
      );
  }

  startLesson(lessonID) {
    this.restService
      .start_lesson(lessonID)
      .subscribe(
        lessonRun =>
          this.router.navigate(['/screen/lesson/' + lessonRun.lessonrun_code]),
        err => console.log(err)
      );
  }
}

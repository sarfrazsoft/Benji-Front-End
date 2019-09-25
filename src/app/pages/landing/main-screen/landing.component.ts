import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthService,
  BackendRestService,
  ContextService
} from 'src/app/services';

@Component({
  selector: 'benji-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingComponent {
  partnerName: string;
  constructor(
    private restService: BackendRestService,
    public contextService: ContextService,
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

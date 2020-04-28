import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthService,
  BackendRestService,
  ContextService,
} from 'src/app/services';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

@Component({
  selector: 'benji-icebreaker',
  templateUrl: './icebreaker.component.html',
  styleUrls: ['./icebreaker.component.scss'],
})
export class IcebreakerComponent implements OnInit {
  partnerName: string;
  lightLogo: string;

  constructor(
    private restService: BackendRestService,
    public contextService: ContextService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.lightLogo = info.parameters.lightLogo;
        this.partnerName = info.parameters.partnerName;
      }
    });
  }

  loginAndStart(lessonID) {
    this.auth.login('matt', 'test').subscribe(
      null,
      (err) => console.error(`Error on authentication: ${err}`),
      () => this.startLesson(lessonID)
    );
  }

  startLesson(lessonID) {
    this.restService.start_lesson(lessonID).subscribe(
      (lessonRun) =>
        this.router.navigate(['/screen/lesson/' + lessonRun.lessonrun_code]),
      (err) => console.log(err)
    );
  }
}

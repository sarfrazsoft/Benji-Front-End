import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService, BackendRestService, ContextService, EmojiLookupService } from 'src/app/services';
import { LessonRunDetails, Participant } from 'src/app/services/backend/schema/course_details';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

@Component({
  selector: 'benji-participant-login',
  templateUrl: './participant-login.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantLoginComponent implements OnInit {
  // username: string;

  public isUserValid: boolean;
  public userId;
  public loginError;
  public welcomeText = '';

  public username = new FormControl(null, [Validators.required]);
  lessonRunDetails: LessonRunDetails;

  emoji2;
  constructor(
    private backend: BackendRestService,
    private auth: AuthService,
    public router: Router,
    private contextService: ContextService,
    private emoji: EmojiLookupService
  ) {}

  ngOnInit() {
    this.auth.logout();

    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.welcomeText = info.welcome_text;
      }
    });

    if (localStorage.getItem('lessonRunDetails')) {
      this.lessonRunDetails = JSON.parse(localStorage.getItem('lessonRunDetails'));
    }
  }

  formSubmit() {
    // this.auth.login(this.username, 'test').subscribe(
    //   resp => this.router.navigate(['/participant/join']),
    //   err => this.restService.create_user(this.username).subscribe(
    //     resp2 => this.auth.login(this.username, 'test').subscribe(
    //       resp3 => this.router.navigate(['/participant/join']),
    //       err3 => console.log(err3)
    //     ),
    //     err2 => console.log(err2)
    //   )
    // );
  }

  public createUser() {
    if (this.auth.isLoggedIn()) {
      this.auth.logout();
    }

    if (!isNaN(this.username.value)) {
      this.loginError = true;
      return false;
    }

    this.backend
      .createUser(this.username.value, this.lessonRunDetails.lessonrun_code)
      .subscribe((res: Participant) => {
        this.loginError = false;
        if (res.lessonrun_code) {
          localStorage.setItem('participant', JSON.stringify(res));
          this.router.navigate([`/participant/lesson/${res.lessonrun_code}`]);
        } else {
          this.loginError = true;
        }
      });
  }
}
declare var twemoji: {
  convert: { fromCodePoint(str: string): string };
  parse(str: string, options?: { folder: string; ext: string }): string;
};

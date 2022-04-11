import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, BackendRestService, ContextService, EmojiLookupService } from 'src/app/services';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'benji-participant-login',
  templateUrl: './participant-login.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantLoginComponent implements OnInit {
  // username: string;

  // public isUserValid: boolean;
  // public userId;
  // public loginError;
  // public welcomeText = '';

  // public username = new FormControl(null, [Validators.required]);
  // lessonRunDetails: LessonRunDetails;

  emoji2;
  constructor(
    private backend: BackendRestService,
    private auth: AuthService,
    public router: Router,
    private contextService: ContextService,
    private emoji: EmojiLookupService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    // this.auth.logout();
    // this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
    //   if (info) {
    //     this.welcomeText = info.welcome_text;
    //   }
    // });
    // if (localStorage.getItem('lessonRunDetails')) {
    //   this.lessonRunDetails = JSON.parse(localStorage.getItem('lessonRunDetails'));
    // }
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
    //   if (this.auth.isLoggedIn()) {
    //     this.auth.logout();
    //   }
    //   if (!isNaN(this.username.value)) {
    //     this.loginError = true;
    //     return false;
    //   }
    //   this.auth.createParticipant(this.username.value, this.lessonRunDetails.lessonrun_code).subscribe(
    //     (res: Participant) => {
    //       this.loginError = false;
    //       if (res.lessonrun_code) {
    //         localStorage.setItem('participant', JSON.stringify(res));
    //         this.router.navigate([`/participant/lesson/${res.lessonrun_code}`]);
    //       } else {
    //         this.loginError = true;
    //       }
    //     },
    //     (err) => {
    //       console.log(err);
    //       if (err && err.error && err.error.non_field_errors) {
    //         if (err.error.non_field_errors[0] === 'A participant with that display name already exists') {
    //           console.log('err');
    //           this.utilsService.openWarningNotification(
    //             'A participant with that name has already joined. Try a different name.',
    //             ''
    //           );
    //         }
    //       }
    //     }
    //   );
  }
}
// declare var twemoji: {
//   convert: { fromCodePoint(str: string): string };
//   parse(str: string, options?: { folder: string; ext: string }): string;
// };

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import * as global from 'src/app/globals';
import { AuthService, BackendRestService, ContextService } from 'src/app/services';
import { Branding, TeamUser } from 'src/app/services/backend/schema';
import {
  BeforeLessonRunDetails,
  CoverPhoto,
  LessonRunDetails,
} from 'src/app/services/backend/schema/course_details';
import { LessonService } from 'src/app/services/lesson.service';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'benji-participant-join',
  templateUrl: './participant-join.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantJoinComponent implements OnInit {
  public beforeLessonRunDetails: BeforeLessonRunDetails;
  roomCode: number;

  public isRoomCodeValid;
  public userName: string;
  public loginError;
  participantAlreadyExistsError = false;
  public isInformationValid = false;
  public typingTimer;
  public lessonRunDetails: LessonRunDetails;
  lessonrRunImages: Array<CoverPhoto>;

  tokenCleared = false;
  public username = new FormControl(null, [Validators.required]);

  shareParticipantLink = '';
  hostname = window.location.host + '/participant/join?link=';
  loadLogin: boolean;
  loadSignUp: boolean;
  loadForgotPassword: boolean;
  logo: string;
  coverPhoto: string;
  maxIdIndex: number;

  hostLocation = environment.web_protocol + '://' + environment.host;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient,
    private backend: BackendRestService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private contextService: ContextService,
    private lessonService: LessonService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((val: any) => {
      if (this.route.snapshot.queryParams['link']) {
        this.roomCode = this.route.snapshot.queryParams['link'];
        this.updateBeforeLessonRunDetails();
        this.validateRoomCode();
      }
    });
    this.username.disable();
    if (!this.userName) {
      this.backend.get_own_identity().subscribe(
        (res) => {
          this.userName = res.first_name;
        },
        (err) => {
          // this.router.navigate([`/login`]);
        }
      );
    }
    // check if user is logged in
    if (this.authService.isLoggedIn()) {
      if (localStorage.getItem('user')) {
        const user: TeamUser = JSON.parse(localStorage.getItem('user'));
        this.authService.joinSessionAsLoggedInUser(user, this.roomCode, (isError) => {
          this.loginError = isError;
        });
      }
    }
    this.contextService.brandingInfo$.subscribe((info: Branding) => {
      if (info) {
        this.logo = info.logo ? info.logo.toString() : '/assets/img/Benji_logo.svg';
      }
    });
  }

  joinSessionAsLoggedInUser() {
    const user: TeamUser = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    this.authService.joinSessionAsLoggedInUser(user, this.roomCode, (isError) => {
      this.loginError = isError;
    });
  }

  public validateRoomCode() {
    this.backend.validateRoomCode(this.roomCode).subscribe(
      (res: LessonRunDetails) => {
        // We have lessonrun_images in res. One of them is being used as cover photo
        this.lessonrRunImages = res.lessonrun_images;
        this.coverPhoto = this.lessonService.setCoverPhoto(this.lessonrRunImages);

        this.backend.userEnteredroomCode = this.roomCode;
        const lessonrun_code = res.lessonrun_code;
        localStorage.setItem('lessonRunDetails', JSON.stringify(res));
        this.isRoomCodeValid = true;
        this.username.enable();
      },
      (err) => {
        console.error(`Unable to join: ${err.error.error}`);
        console.log(err);
        if (err.error.code === 'token_not_valid' && !this.tokenCleared) {
          localStorage.removeItem('token');
          this.tokenCleared = true;
          this.validateRoomCode();
        }
        this.isRoomCodeValid = false;
      }
    );
  }

  public joinSessionAsGuestParticipant() {
    if (localStorage.getItem('lessonRunDetails')) {
      this.lessonRunDetails = JSON.parse(localStorage.getItem('lessonRunDetails'));
    } else {
      return false;
    }
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
    }

    if (!this.username.value) {
      this.participantAlreadyExistsError = false;
      this.loginError = true;
      return false;
    }

    this.authService.createParticipant(this.username.value, this.lessonRunDetails.lessonrun_code).subscribe(
      (res: any) => {
        console.log(res);
        this.loginError = false;
        this.participantAlreadyExistsError = false;
        if (res.lessonrun_code) {
          if (localStorage.getItem('user')) {
            localStorage.removeItem('user');
          }
          if (this.authService.redirectURL.length) {
            window.location.href = this.authService.redirectURL;
          } else {
            this.router.navigate(['/screen/lesson/' + res.lessonrun_code]);
          }
        } else if (res && res.message === 'A participant with that display name already exists') {
          // this.participantAlreadyExistsError = true;
          this.utilsService.openWarningNotification(
            'A participant with that name has already joined. Try a different name.',
            ''
          );
        } else {
          this.loginError = true;
        }
      },
      (err) => {
        console.log(err);
        if (err && err.error && err.error.non_field_errors) {
          if (err.error.non_field_errors[0] === 'A participant with that display name already exists') {
          }
        }
      }
    );
  }

  getInitials(nameString: string) {
    const fullName = nameString.split(' ');
    const first = fullName[0] ? fullName[0].charAt(0) : '';
    if (fullName.length === 1) {
      return first.toUpperCase();
    }
    const second = fullName[fullName.length - 1] ? fullName[fullName.length - 1].charAt(0) : '';
    return (first + second).toUpperCase();
  }

  loadLoginComponent() {
    this.loadSignUp = false;
    this.loadForgotPassword = false;
    this.loadLogin = true;
  }
  loadForgotPasswordComponent() {
    this.loadSignUp = false;
    this.loadForgotPassword = true;
    this.loadLogin = false;
  }
  loadSignUpComponent() {
    this.loadSignUp = true;
    this.loadForgotPassword = false;
    this.loadLogin = false;
  }
  loadGuestJoin() {
    this.loadSignUp = false;
    this.loadForgotPassword = false;
    this.loadLogin = false;
  }

  getBeforeLessonRunDetails(lessonrun_code) {
    const request = global.apiRoot + '/course_details/lesson_run/' + lessonrun_code + '/lessonrun_details/';
    return this.http.post(request, {});
  }

  updateBeforeLessonRunDetails() {
    this.getBeforeLessonRunDetails(this.roomCode).subscribe((res: BeforeLessonRunDetails) => {
      this.beforeLessonRunDetails = res;
    });
  }
}

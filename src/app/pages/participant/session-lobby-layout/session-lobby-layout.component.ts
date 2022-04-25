import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as global from 'src/app/globals';
import { AuthService, BackendRestService, BackendSocketService } from 'src/app/services';
import {
  BeforeLessonRunDetails,
  LessonRunDetails,
  Participant,
} from 'src/app/services/backend/schema/course_details';
import { TeamUser, User } from 'src/app/services/backend/schema/user';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'benji-session-lobby-layout',
  templateUrl: './session-lobby-layout.component.html',
})
export class SessionLobbyLayoutComponent implements OnInit {
  @Input() beforeLessonRunDetails: BeforeLessonRunDetails;
  @Input() participantJoinScreeen;
  @Input() participantLobbyScreeen;
  @Input() adminLobbyScreeen;
  @Input() room_code;
  @Input() latestParticipants;
  @Output() startLessonEvent = new EventEmitter<string>();
  public isRoomCodeValid = true;
  public userName: string;
  public loginError;
  public isInformationValid = false;
  public typingTimer;
  public lessonRunDetails: LessonRunDetails;

  tokenCleared = false;

  public roomCode = new FormControl(null, [Validators.required, Validators.min(4)]);
  public username = new FormControl(null, [Validators.required]);

  shareParticipantLink = '';
  hostname = window.location.host + '/participant/join?link=';
  loadLogin: boolean;
  loadSignUp: boolean;
  loadForgotPassword: boolean;
  mobileParticipantJoin: boolean;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private backend: BackendRestService,
    private socket: BackendSocketService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private permissionsService: NgxPermissionsService,
    private http: HttpClient,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    if (this.route.snapshot.queryParams['link']) {
      this.roomCode.setValue(this.route.snapshot.queryParams['link']);
      this.validateRoomCode();
    }
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
    this.shareParticipantLink = this.hostname + this.room_code;

    //
    // check if user is logged in
    if (this.authService.isLoggedIn()) {
      if (localStorage.getItem('user')) {
        const user: TeamUser = JSON.parse(localStorage.getItem('user'));
        this.joinSessionAsLoggedInUser(user);
      }
    }
  }

  joinSessionAsLoggedInUser(user: TeamUser) {
    const name = user.first_name + ' ' + user.last_name;
    const lessonCode = this.roomCode.value;
    console.log(name, lessonCode);

    this.authService.createParticipant(name, lessonCode, user.id).subscribe(
      (res) => {
        this.loginError = false;
        if (res.lessonrun_code) {
          this.navigateToLesson(res.lessonrun_code);
        } else if (res.message === 'You are already in this session.') {
          this.authService.setParticipantSession(res.participant);
          this.navigateToLesson(res.participant.lessonrun_code);
        } else {
          this.loginError = true;
        }
      },
      (err) => {
        if (err && err.error) {
          if (err.error.non_field_errors) {
            if (err.error.non_field_errors[0] === 'A participant with that display name already exists') {
              this.utilsService.openWarningNotification(
                'A participant with that name has already joined. Try a different name.',
                ''
              );
            }
          }
        }
      }
    );
  }

  navigateToLesson(lessonRunCode) {
    this.router.navigate(['/screen/lesson/' + lessonRunCode]);
  }

  public validateRoomCode() {
    this.backend.validateRoomCode(this.roomCode.value).subscribe(
      (res: LessonRunDetails) => {
        this.backend.userEnteredroomCode = this.roomCode.value;
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

  isNameValid() {
    if (this.username.valid) {
      return true;
    } else {
      return false;
    }
  }

  public createUser() {
    if (localStorage.getItem('lessonRunDetails')) {
      this.lessonRunDetails = JSON.parse(localStorage.getItem('lessonRunDetails'));
    } else {
      return false;
    }
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
    }

    if (!isNaN(this.username.value)) {
      this.loginError = true;
      return false;
    }

    this.authService.createParticipant(this.username.value, this.lessonRunDetails.lessonrun_code).subscribe(
      (res: Participant) => {
        this.loginError = false;
        if (res.lessonrun_code) {
          if (localStorage.getItem('user')) {
            localStorage.removeItem('user');
          }
          this.router.navigate(['/screen/lesson/' + res.lessonrun_code]);
          // this.router.navigate([`/participant/lesson/${res.lessonrun_code}`]);
        } else {
          this.loginError = true;
        }
      },
      (err) => {
        console.log(err);
        if (err && err.error && err.error.non_field_errors) {
          if (err.error.non_field_errors[0] === 'A participant with that display name already exists') {
            console.log('err');
            this.utilsService.openWarningNotification(
              'A participant with that name has already joined. Try a different name.',
              ''
            );
          }
        }
      }
    );
  }

  onSearchChange(searchValue: string): void {
    this.validateRoomCode();
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

  copyLink(val: string) {
    this.utilsService.copyToClipboard(val);
  }

  kickOffLesson() {
    this.startLessonEvent.emit('startLesson');
  }

  loadLoginComponent() {
    this.loadSignUp = false;
    this.loadForgotPassword = false;
    this.loadLogin = true;
    if (this.deviceService.isMobile()) {
      this.mobileParticipantJoin = true;
    }
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
    if (this.deviceService.isMobile()) {
      this.mobileParticipantJoin = true;
    }
  }
}

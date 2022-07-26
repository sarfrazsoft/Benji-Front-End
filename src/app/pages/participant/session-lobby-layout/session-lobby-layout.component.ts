import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as global from 'src/app/globals';
import { AuthService, BackendRestService, BackendSocketService, ContextService } from 'src/app/services';
import {
  BeforeLessonRunDetails,
  LessonRunDetails,
  Participant,
} from 'src/app/services/backend/schema/course_details';
import { Branding, TeamUser, User } from 'src/app/services/backend/schema/user';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
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
  public isRoomCodeValid;
  public userName: string;
  public loginError;
  participantAlreadyExistsError = false;
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
  logo: string;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private backend: BackendRestService,
    private socket: BackendSocketService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private permissionsService: NgxPermissionsService,
    private http: HttpClient,
    private contextService: ContextService,
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
    // check if user is logged in
    if (this.authService.isLoggedIn()) {
      if (localStorage.getItem('user')) {
        const user: TeamUser = JSON.parse(localStorage.getItem('user'));
        this.authService.joinSessionAsLoggedInUser(user, this.roomCode.value, (isError) => {
          this.loginError = isError;
        });
      }
    }
    this.contextService.brandingInfo$.subscribe((info: Branding) => {
      if (info) {
        this.logo =  info.logo? info.logo.toString() : "/assets/img/Benji_logo.svg";
      }
    });
  }

  joinSessionAsLoggedInUser() {
    const user: TeamUser = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    this.authService.joinSessionAsLoggedInUser(user, this.roomCode.value, (isError) => {
      this.loginError = isError;
    });
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

  public joinSessionAsGuestParticipant() {
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
      (res: any) => {
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
          this.participantAlreadyExistsError = true;
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

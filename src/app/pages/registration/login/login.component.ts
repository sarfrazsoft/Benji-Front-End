import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService, ContextService } from 'src/app/services';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

import { SocialAuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { NgxPermissionsService } from 'ngx-permissions';
import { LoginResponse } from 'src/app/services/auth/auth.service';
import { Branding, TeamUser, User } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-dashboard-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  @Input() joinSessionScreen: boolean;
  @Output() signUpClicked = new EventEmitter();
  @Output() forgotPasswordClicked = new EventEmitter();
  @Output() userSignedInSuccessfully = new EventEmitter();
  form: FormGroup;
  isLoginClicked = false;
  emailPasswordError = false;
  isDemoSite = true;
  // roomCode: number;
  logo;

  user: SocialUser | null;
  roomCode: any;
  participantCode: any;
  loginError: any;

  constructor(
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private authService: AuthService,
    public router: Router,
    private deviceDetectorService: DeviceDetectorService,
    private contextService: ContextService,
    private socialAuthService: SocialAuthService,
    private permissionsService: NgxPermissionsService
  ) {
    this.user = null;
    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      console.log(user);
      this.authService.validateGoogleToken(user.idToken).subscribe((res) => {
        if (this.authService.redirectURL.length) {
          window.location.href = this.authService.redirectURL;
        } else {
          this.deviceDetectorService.isMobile()
            ? this.router.navigate(['/participant/join'])
            : this.router.navigate(['/dashboard']);
        }
      });
      this.user = user;
    });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((x: any) => console.log(x));
  }

  signOut(): void {
    this.authService.signOut();
  }

  ngOnInit() {
    this.contextService.brandingInfo$.subscribe((info: Branding) => {
      if (info) {
        this.logo = info.logo ? info.logo.toString() : '/assets/img/Benji_logo.svg';
      }
    });

    this.form = this.builder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: '',
    });

    if (this.route.snapshot.queryParams['link']) {
      // alert(this.route.snapshot.queryParams['link']);
      this.roomCode = this.route.snapshot.queryParams['link'];
    }
    if (this.route.snapshot.queryParams['userCode']) {
      // alert(this.route.snapshot.queryParams['userCode']);
      this.participantCode = this.route.snapshot.queryParams['userCode'];
    }
    if (this.roomCode && this.participantCode) {
      console.log(this.roomCode, this.participantCode);
    }
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  get password(): AbstractControl {
    return this.form.get('password');
  }

  onSubmit(): void {
    this.isLoginClicked = true;
    if (this.form.valid) {
      const val = this.form.value;
      this.authService.signIn(val.email.toLowerCase(), val.password).subscribe(
        (res: LoginResponse) => {
          // if (localStorage.getItem('participant')) {
          //   localStorage.removeItem('participant');
          // }
          if (res) {
            this.emailPasswordError = true;
          } else {
            if (this.authService.redirectURL.length) {
              window.location.href = this.authService.redirectURL;
            } else {
              this.deviceDetectorService.isMobile()
                ? this.router.navigate(['/participant/join'])
                : this.joinSessionScreen
                ? this.joinSessionAsLoggedInUser(res.user, this.roomCode)
                : this.router.navigate(['/dashboard']);
            }
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  joinSessionAsLoggedInUser(user: TeamUser, roomCode: number) {
    this.authService.joinSessionAsLoggedInUser(user, roomCode, (isError) => {
      this.loginError = isError;
    });
  }

  signUpClick() {
    if (this.joinSessionScreen) {
      this.signUpClicked.emit();
    } else if (this.roomCode && this.participantCode) {
      // move to login with roomcode and participantCode
      this.router.navigateByUrl('/sign-up?link=' + this.roomCode + '&userCode=' + this.participantCode);
    } else {
      this.router.navigate(['/sign-up']);
    }
  }

  forgotPasswordClick() {
    this.joinSessionScreen ? this.forgotPasswordClicked.emit() : this.router.navigate(['/forgot-password']);
  }
}

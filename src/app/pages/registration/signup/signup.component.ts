import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService, ContextService } from 'src/app/services';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

import { SocialAuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { Branding, TeamUser, User } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-dashboard-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  @Input() joinSessionScreen: boolean;
  @Output() signInClicked = new EventEmitter();
  @Output() userSignedInSuccessfully = new EventEmitter();
  form: FormGroup;
  isSignupClicked = false;
  isSubmitted = false;
  passwordMinLenErr = false;
  emailErr = false;
  emailErrMsg = '';
  firstName = '';
  lastName = '';
  isDemoSite = true;

  logo;

  user: SocialUser | null;
  roomCode: any;
  participantCode: string;
  loginError: any;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private contextService: ContextService,
    private deviceService: DeviceDetectorService,
    private route: ActivatedRoute,
    public router: Router,
    private socialAuthService: SocialAuthService
  ) {
    // demo.mybenji.com
    if (window.location.href.split('.')[0].includes('demo')) {
      this.isDemoSite = true;
    }

    this.user = null;
    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      this.authService.validateGoogleToken(user.idToken).subscribe((res) => {
        if (this.authService.redirectURL.length) {
          window.location.href = this.authService.redirectURL;
        } else {
          this.deviceService.isMobile()
            ? this.router.navigate(['/participant/join'])
            : this.router.navigate(['/dashboard']);
        }
      });
      this.user = user;
    });
  }

  ngOnInit() {

    this.contextService.brandingInfo$.subscribe((info: Branding) => {
      if (info) {
        this.logo = info.logo ? info.logo.toString() : "/assets/img/Benji_logo.svg";
      }
    });

    this.form = this.builder.group(
      {
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        lastName: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        // confirmPassword: new FormControl('', [Validators.required]),
      },
      {
        // validator: this.checkIfMatchingPasswords('password', 'confirmPassword'),
      }
    );

    if (this.authService.userInvitation) {
      this.form.get('email').setValue(this.authService.userInvitation.email);
      if (this.authService.userInvitation.suggested_first_name) {
        this.form
          .get('name')
          .setValue(
            this.authService.userInvitation.suggested_first_name +
            ' ' +
            this.authService.userInvitation.suggested_last_name
          );
        // this.form.get('lastName').setValue(this.authService.userInvitation.suggested_last_name);
      }
    }

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

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  get name(): AbstractControl {
    return this.form.get('name');
  }

  get last_name(): AbstractControl {
    return this.form.get('lastName');
  }

  get password(): AbstractControl {
    return this.form.get('password');
  }

  // get confirmPassword(): AbstractControl {
  //   return this.form.get('confirmPassword');
  // }

  emailChanged() {
    this.emailErr = false;
    this.emailErrMsg = '';
  }

  onSubmit(): void {
    this.isSignupClicked = true;
    if (this.form.valid) {
      const val = this.form.value;
      const myArr = val.name.split(' ');
      this.firstName = myArr[0];
      this.lastName = val.lastName;
      // myArr[1] ? (this.lastName = myArr[1]) : (this.lastName = ' ');
      // if (myArr[2]) {
      //   this.lastName += ' ' + myArr[2];
      // }
      console.log('First Name: ' + this.firstName);
      console.log('Last Name: ' + this.lastName);
      this.authService
        .register(val.email.toLowerCase(), val.password, this.firstName, this.lastName)
        .subscribe(
          (res) => {
            console.log(res.user);
            if (this.participantCode && res.user.id) {
              this.authService.patchParticipant(this.participantCode, res.user.id).subscribe((result) => {
                console.log(result);
              });
            }
            if (res.token) {
              this.isSubmitted = true;
              this.authService.signIn(val.email.toLowerCase(), val.password).subscribe(
                (signInRes) => {
                  if (res.token) {
                    // if (this.authService.redirectURL.length) {
                    // window.location.href = this.authService.redirectURL;
                    // } else {
                    this.deviceService.isMobile()
                      ? this.router.navigate(['/participant/join'])
                      : this.roomCode
                        ? this.joinSessionAsLoggedInUser(res.user, this.roomCode)
                        : this.router.navigate(['/dashboard']);
                    // }
                  } else {
                  }
                },
                (err) => {
                  console.log(err);
                }
              );
              return;
            }

            if (res.password1) {
              this.passwordMinLenErr = true;
            }

            if (res.email) {
              this.emailErr = true;
              this.emailErrMsg = res.email[0];
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

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((x: any) => console.log(x));
  }

  onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  openSignInScreen() {
    if (this.joinSessionScreen) {
      this.signInClicked.emit();
    } else if (this.roomCode && this.participantCode) {
      // move to login with roomcode and participantCode
      this.router.navigateByUrl('/login?link=' + this.roomCode + '&userCode=' + this.participantCode);
    } else {
      this.router.navigate(['/login']);
    }
  }

}

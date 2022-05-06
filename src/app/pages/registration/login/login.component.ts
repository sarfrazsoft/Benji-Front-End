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

@Component({
  selector: 'benji-dashboard-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  @Input() joinSession: boolean;
  @Input() sllRoomCode: number;
  @Output() signUp = new EventEmitter();
  @Output() forgotPassword = new EventEmitter();
  form: FormGroup;
  isLoginClicked = false;
  emailPasswordError = false;
  isDemoSite = true;
  // roomCode: number;
  logo;

  user: SocialUser | null;

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
    // demo.mybenji.com
    if (window.location.href.split('.')[0].includes('demo')) {
      this.isDemoSite = true;
    }

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
    // if (this.route.snapshot.queryParams['link']) {
    //   this.roomCode.setValue(this.route.snapshot.queryParams['link']);
    //   this.validateRoomCode();
    // }
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.logo = info.parameters.darkLogo;
      }
    });

    this.form = this.builder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: '',
    });
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
        (res) => {
          // if (localStorage.getItem('participant')) {
          //   localStorage.removeItem('participant');
          // }
          if (res) {
            this.emailPasswordError = true;
          } else {
            if (this.authService.redirectURL.length) {
              window.location.href = this.authService.redirectURL;
            } else {
              console.log(this.sllRoomCode);
              this.deviceDetectorService.isMobile()
                ? this.router.navigate(['/participant/join'])
                : this.sllRoomCode
                ? this.router.navigateByUrl('/screen/lesson/' + this.sllRoomCode)
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

  signUpClick() {
    this.joinSession ? this.signUp.emit() : this.router.navigate(['/sign-up']);
  }

  forgotPasswordClicked() {
    this.joinSession ? this.forgotPassword.emit() : this.router.navigate(['/forgot-password']);
  }
}

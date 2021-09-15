import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService, ContextService } from 'src/app/services';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

import { SocialAuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'benji-dashboard-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isLoginClicked = false;
  emailPasswordError = false;
  isDemoSite = true;

  logo;

  user: SocialUser | null;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    public router: Router,
    private deviceService: DeviceDetectorService,
    private contextService: ContextService,
    private socialAuthService: SocialAuthService
  ) {
    // demo.mybenji.com
    if (window.location.href.split('.')[0].includes('demo')) {
      this.isDemoSite = true;
    }

    this.user = null;
    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      console.log(user);
      this.authService.validateGoogleToken(user.idToken).subscribe((res) => {
        this.authService.setFacilitatorSession(res);
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

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((x: any) => console.log(x));
  }

  signOut(): void {
    this.authService.signOut();
  }

  ngOnInit() {
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
          console.log(res);
          if (res) {
            this.emailPasswordError = true;
          } else {
            if (this.authService.redirectURL.length) {
              window.location.href = this.authService.redirectURL;
            } else {
              this.deviceService.isMobile()
                ? this.router.navigate(['/participant/join'])
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
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService, ContextService } from 'src/app/services';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

@Component({
  selector: 'benji-login-new',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isLoginClicked = false;
  emailPasswordError = false;
  isDemoSite = true;
  @Output() showSignupTab = new EventEmitter();

  logo;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    public router: Router,
    private deviceService: DeviceDetectorService,
    private contextService: ContextService
  ) {
    // demo.mybenji.com
    if (window.location.href.split('.')[0].includes('demo')) {
      this.isDemoSite = true;
    }
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

    if (this.authService.userInvitation) {
      this.showSignupTab.emit();
    }
  }

  showSignup(): void {
    this.showSignupTab.emit();
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  onSubmit(): void {
    this.isLoginClicked = true;
    if (this.form.valid) {
      const val = this.form.value;
      this.authService.signIn(val.email.toLowerCase(), val.password).subscribe(
        (res) => {
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

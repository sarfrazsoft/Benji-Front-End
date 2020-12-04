import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService, ContextService } from 'src/app/services';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

@Component({
  selector: 'benji-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  requestSubmitted = false;
  isSignupClicked = false;

  uid = '';
  token = '';

  logo;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    public router: Router,
    private deviceService: DeviceDetectorService,
    private contextService: ContextService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.logo = info.parameters.darkLogo;
      }
    });

    this.activatedRoute.params.subscribe((params) => {
      this.uid = params['uid'];
      this.token = params['token'];
    });

    this.form = this.builder.group(
      {
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      {
        validator: this.checkIfMatchingPasswords('password', 'confirmPassword'),
      }
    );
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

  get password(): AbstractControl {
    return this.form.get('password');
  }

  get confirmPassword(): AbstractControl {
    return this.form.get('confirmPassword');
  }

  onSubmit(): void {
    this.isSignupClicked = true;
    if (this.form.valid) {
      const val = this.form.value;
      this.authService
        .resetPasswordConfirm(val.password, val.confirmPassword, this.uid, this.token)
        .subscribe(
          (res) => {
            if (res) {
              this.requestSubmitted = true;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
}

// http://localhost:4200/reset_password/Mw/5m3-7dc743b6b75192301705/

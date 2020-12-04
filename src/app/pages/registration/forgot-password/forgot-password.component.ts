import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService, ContextService } from 'src/app/services';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

@Component({
  selector: 'benji-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  requestSubmitted = false;
  emailPasswordError = false;

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

    this.form = this.builder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  onSubmit(): void {
    if (this.form.valid) {
      const val = this.form.value;
      this.authService.resetPassword(val.email.toLowerCase()).subscribe(
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

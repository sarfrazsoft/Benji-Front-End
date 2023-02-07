import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService, ContextService } from 'src/app/services';
import { Branding, PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

@Component({
  selector: 'benji-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {
  @Input() joinSession: boolean;
  @Input() displayJoinAsGuest = false;
  @Output() signInClicked = new EventEmitter();
  @Output() guestJoinClicked = new EventEmitter();
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
    this.contextService.brandingInfo$.subscribe((info: Branding) => {
      if (info) {
        this.logo = info.logo ? info.logo.toString() : '/assets/img/Benji_logo.svg';
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

  openSignInScreen() {
    this.joinSession ? this.signInClicked.emit() : this.router.navigate(['/login']);
  }

  guestJoinClick() {
    this.guestJoinClicked.emit();
  }
}

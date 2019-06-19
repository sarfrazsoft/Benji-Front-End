import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'benji-login-mobile',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isLoginClicked = false;
  emailPasswordError = false;
  isDemoSite = false;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private deviceService: DeviceDetectorService
  ) {
    // demo.mybenji.com
    if (window.location.href.split('.')[0].includes('demo')) {
      this.isDemoSite = true;
    }
  }

  ngOnInit() {
    this.form = this.builder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: ''
    });
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  onSubmit(): void {
    this.isLoginClicked = true;
    if (this.form.valid) {
      const val = this.form.value;
      this.authService.signIn(val.email, val.password).subscribe(
        res => {
          if (res) {
            this.emailPasswordError = true;
          } else {
            this.deviceService.isMobile()
              ? this.router.navigate(['/participant/join'])
              : this.router.navigate(['/dashboard']);
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}

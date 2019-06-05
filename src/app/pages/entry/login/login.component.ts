import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'benji-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isLoginClicked = false;
  emailPasswordError = false;
  isDemoSite = false;
  @Output() showSignupTab = new EventEmitter();

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private router: Router
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
      this.authService.signIn(val.email, val.password).subscribe(
        res => {
          if (res) {
            this.emailPasswordError = true;
          } else {
            // this.router.navigate(['/dashboard']);
            this.router.navigate(['/participant/join']);
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}

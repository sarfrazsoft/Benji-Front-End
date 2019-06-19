import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'benji-signup-mobile',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  isSignupClicked = false;
  isSubmitted = false;
  passwordMinLenErr = false;
  emailErr = false;
  emailErrMsg = '';

  constructor(private builder: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.form = this.builder.group(
      {
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8)
        ]),
        confirmPassword: new FormControl('', [Validators.required])
      },
      {
        validator: this.checkIfMatchingPasswords('password', 'confirmPassword')
      }
    );
  }

  checkIfMatchingPasswords(
    passwordKey: string,
    passwordConfirmationKey: string
  ) {
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

  get firstName(): AbstractControl {
    return this.form.get('firstName');
  }

  get lastName(): AbstractControl {
    return this.form.get('lastName');
  }

  get password(): AbstractControl {
    return this.form.get('password');
  }

  get confirmPassword(): AbstractControl {
    return this.form.get('confirmPassword');
  }

  emailChanged() {
    this.emailErr = false;
    this.emailErrMsg = '';
  }

  onSubmit(): void {
    this.isSignupClicked = true;
    if (this.form.valid) {
      console.log(this.form.value);
      const val = this.form.value;
      this.authService
        .register(val.email, val.password, val.firstName, val.lastName)
        .subscribe(
          res => {
            if (res.token) {
              this.isSubmitted = true;
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
          err => {
            console.log(err);
          }
        );
    }
  }
}

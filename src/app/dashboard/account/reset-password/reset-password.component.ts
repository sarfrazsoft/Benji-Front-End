import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { AccountService } from '../services';

@Component({
  selector: 'benji-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  passwordMinLenErr = false;
  isSubmitted = false;
  passwordChanged = false;
  invalidOldPassword = false;

  constructor(
    private accountService: AccountService,
    private builder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.builder.group(
      {
        old_password: new FormControl('', [Validators.required]),
        new_password1: new FormControl('', [
          Validators.required,
          Validators.minLength(8)
        ]),
        new_password2: new FormControl('', [Validators.required])
      },
      {
        validator: this.checkIfMatchingPasswords(
          'new_password1',
          'new_password2'
        )
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

  get old_password(): AbstractControl {
    return this.form.get('old_password');
  }

  get new_password1(): AbstractControl {
    return this.form.get('new_password1');
  }

  get new_password2(): AbstractControl {
    return this.form.get('new_password2');
  }

  onSubmit(): void {
    if (this.form.valid) {
      const val = this.form.value;
      this.accountService
        .resetPassword(val.old_password, val.new_password1, val.new_password2)
        .subscribe(
          res => {
            this.isSubmitted = true;
            if (res.detail === 'New password has been saved.') {
              this.passwordChanged = true;
            }
          },
          err => {
            if (err.error.old_password) {
              this.invalidOldPassword = true;
            }
          }
        );
    }
  }
}

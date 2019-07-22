import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { merge } from 'lodash';
import { AuthService } from 'src/app/services';
import { AccountService } from './services';

@Component({
  selector: 'benji-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  form: FormGroup;
  isSignupClicked = false;
  isSubmitted = false;
  passwordMinLenErr = false;
  emailErr = false;
  emailErrMsg = '';
  accontInfo;

  constructor(
    private builder: FormBuilder,
    private accountService: AccountService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.builder.group({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      job_title: ''
      // oldPassword: ''
    });

    this.route.data.forEach((data: any) => {
      this.accontInfo = data.dashData.user;
      this.form.patchValue(this.accontInfo);
    });
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  get first_name(): AbstractControl {
    return this.form.get('first_name');
  }

  get last_name(): AbstractControl {
    return this.form.get('last_name');
  }

  get job_title(): AbstractControl {
    return this.form.get('job_title');
  }

  get oldPassword(): AbstractControl {
    return this.form.get('oldPassword');
  }

  emailChanged() {
    this.emailErr = false;
    this.emailErrMsg = '';
  }

  onSubmit(): void {
    this.isSignupClicked = true;
    if (this.form.valid) {
      const val = this.form.value;
      merge(val, this.accontInfo);
      console.log(val);
      this.accountService.saveUser(val).subscribe(
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

import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'lodash';
import { AuthService, ContextService } from 'src/app/services';
import { User } from 'src/app/services/backend/schema';
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
  accontInfo: User;

  constructor(
    private builder: FormBuilder,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private contextService: ContextService
  ) {}

  ngOnInit() {
    this.form = this.builder.group({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      job_title: ''
    });

    this.accontInfo = this.contextService.user;
    this.form.patchValue(this.accontInfo);
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

  onSubmit(): void {
    this.isSignupClicked = true;
    if (this.form.valid) {
      const val = this.form.value;
      merge(val, {
        id: this.accontInfo.id
      });
      this.accountService.saveUser(val).subscribe(
        res => {
          this.isSubmitted = true;
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  passwordPage(): void {
    this.router.navigate(['/dashboard/account/password']);
  }
}

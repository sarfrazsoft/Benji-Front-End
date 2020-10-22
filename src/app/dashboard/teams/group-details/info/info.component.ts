import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { merge } from 'lodash';
import { User } from 'src/app/services/backend/schema';
import { AccountService } from '../../../account/services';

@Component({
  selector: 'benji-group-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  form: FormGroup;
  isSignupClicked = false;
  isSubmitted = false;
  accontInfo = { id: 1 };
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      group_name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    });

    // this.accontInfo = this.contextService.user;
    this.form.patchValue({
      group_name: 'brr group',
      description: 'brr description'
    });
  }

  get group_name(): AbstractControl {
    return this.form.get('group_name');
  }

  get description(): AbstractControl {
    return this.form.get('description');
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
}

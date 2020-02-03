import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { merge } from 'lodash';
import { fromEvent, Observable, Subject } from 'rxjs';
import { AccountService } from '../../account/services/account.service';

@Component({
  selector: 'benji-add-groups',
  templateUrl: './add-groups.component.html',
  styleUrls: ['./add-groups.component.scss']
})
export class AddGroupsComponent implements OnInit {
  eventsSubject: Subject<void> = new Subject<void>();
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
      this.eventsSubject.next(val);
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

  addToGroup() {
    this.eventsSubject.next();
  }
}

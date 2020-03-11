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
import { ContextService } from 'src/app/services';
import { AccountService } from '../../account/services/account.service';
import { GroupsService } from '../services/groups.service';

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
    private accountService: AccountService,
    private groupService: GroupsService,
    private contextService: ContextService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      group_name: new FormControl('', [Validators.required])
      // description: new FormControl('', [Validators.required])
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
      const group_name = this.form.value.group_name;
      const org = this.contextService.user.organization;
      // this.eventsSubject.next(val);
      this.groupService.addGroup(org, group_name).subscribe(
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

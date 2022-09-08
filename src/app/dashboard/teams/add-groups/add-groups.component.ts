import { SelectionChange } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge } from 'lodash';
import { fromEvent, Observable, Subject } from 'rxjs';
import { ContextService } from 'src/app/services';
import { Group, User } from 'src/app/services/backend/schema';
import { AccountService } from '../../account/services/account.service';
import { GroupsService } from '../services/groups.service';

@Component({
  selector: 'benji-add-groups',
  templateUrl: './add-groups.component.html',
  styleUrls: ['./add-groups.component.scss'],
})
export class AddGroupsComponent implements OnInit {
  eventsSubject: Subject<void> = new Subject<void>();
  form: FormGroup;
  isSignupClicked = false;
  isSubmitted = false;
  groupSaved = true;
  accontInfo = { id: 1 };
  groupId;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private groupService: GroupsService,
    private contextService: ContextService,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      team_name: new FormControl('', [Validators.required]),
      // description: new FormControl('', [Validators.required])
    });
  }

  get team_name(): AbstractControl {
    return this.form.get('team_name');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  onSubmit(): void {
    this.isSignupClicked = true;
    if (this.form.valid) {
      const group_name = this.form.value.group_name;
      // const org = this.contextService.user.organization;
      // this.eventsSubject.next(val);
      // this.groupService.addGroup(org, group_name).subscribe(
      //   (res: Group) => {
      //     this.isSubmitted = true;
      //     this.groupSaved = true;
      //     this.groupId = res.id;
      //   },
      //   (err) => {
      //     console.log(err);
      //   }
      // );
    }
  }

  addToGroup() {
    console.log();
    this.eventsSubject.next();
  }

  addRemoveLearner($event: SelectionChange<User>) {
    if ($event.added.length) {
      this.groupService.addLearnerToGroup($event.added[0].id, this.groupId).subscribe((res) => {
        this.matSnackBar.open('Learner added', 'close', {
          duration: 1000,
          panelClass: ['bg-success-color', 'white-color'],
        });
      });
    } else if ($event.removed.length) {
      this.groupService.removeLearnerFromGroup($event.removed[0].id).subscribe((res) => {
        this.matSnackBar.open('Learner removed', 'close', {
          duration: 1000,
          panelClass: ['bg-warning-color', 'white-color'],
        });
      });
    }
  }
}

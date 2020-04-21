import { Component, OnChanges, OnInit } from '@angular/core';
import {
  CaseStudyActivity,
  UserGroupSet,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-case-study-activity',
  templateUrl: './case-study-activity.component.html',
  styleUrls: ['./case-study-activity.component.scss'],
})
export class MainScreenCaseStudyActivityComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  groups: Array<UserGroupSet>;
  act: CaseStudyActivity;
  constructor() {
    super();
  }

  ngOnInit() {}

  ngOnChanges() {
    this.act = this.activityState.casestudyactivity;
    this.groups = this.act.groups;
  }

  getGroupText(userGroup: UserGroupSet): string {
    return userGroup.usergroupuser_set
      .map((u) => u.user.first_name)
      .join(' + ');
  }

  isGroupDone(userGroup: UserGroupSet) {
    const userId = userGroup.usergroupuser_set[0].user.id;
    const myNoteTaker = this.getMyNoteTaker(userId);
    console.log(myNoteTaker.is_done);
    return myNoteTaker.is_done;
  }

  getMyNoteTaker(userId) {
    const myGroupFellows = this.getPeopleFromMyGroup(userId);
    for (let i = 0; i < this.act.casestudyuser_set.length; i++) {
      const casestudyuser = this.act.casestudyuser_set[i];
      if (
        myGroupFellows.includes(casestudyuser.benjiuser_id) &&
        casestudyuser.role === 'Note Taker'
      ) {
        return casestudyuser;
      }
    }
  }

  getPeopleFromMyGroup(userId) {
    for (let i = 0; i < this.act.groups.length; i++) {
      const group = this.act.groups[i];
      for (let j = 0; j < group.usergroupuser_set.length; j++) {
        const user = group.usergroupuser_set[j].user;
        if (user.id === userId) {
          return group.usergroupuser_set.map((obj) => {
            return obj.user.id;
          });
        }
      }
    }
  }
}

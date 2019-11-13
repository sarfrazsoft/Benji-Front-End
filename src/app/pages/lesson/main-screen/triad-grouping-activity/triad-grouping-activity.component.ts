import { Component, OnChanges, OnInit } from '@angular/core';
import {
  TriadGroupingActivity,
  TriadUserGroupUserSet,
  UserGroupUserSet
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-triad-grouping-activity',
  templateUrl: './triad-grouping-activity.component.html',
  styleUrls: ['./triad-grouping-activity.component.scss']
})
export class MainScreenTriadGroupingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  triadAct: TriadGroupingActivity;
  constructor() {
    super();
  }

  ngOnInit() {
    this.triadAct = this.activityState.triadgroupingactivity;
  }

  ngOnChanges() {
    this.triadAct = this.activityState.triadgroupingactivity;
  }

  getGroupText(userGroup): string {
    return userGroup.usergroupuser_set.map(u => u.user.first_name).join(' + ');
  }

  isReversed(): boolean {
    return (
      this.activityState.roleplaypairactivity.reverse_group_activity !== null &&
      this.activityState.roleplaypairactivity.reverse_group_activity !==
        undefined
    );
  }

  isGroupFound(userGroup: TriadUserGroupUserSet): boolean {
    const lostUsers = userGroup.usergroupuser_set.filter(ug => !ug.found);
    if (lostUsers.length) {
      return false;
    } else {
      return true;
    }
  }
}

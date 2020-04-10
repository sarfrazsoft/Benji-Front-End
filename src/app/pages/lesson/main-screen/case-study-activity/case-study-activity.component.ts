import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-case-study-activity',
  templateUrl: './case-study-activity.component.html',
  styleUrls: ['./case-study-activity.component.scss'],
})
export class MainScreenCaseStudyActivityComponent extends BaseActivityComponent
  implements OnInit {
  groups;
  act;
  constructor() {
    super();
  }

  ngOnInit() {
    this.act = this.activityState.casestudyactivity;
    this.groups = this.act.groups;
  }

  getGroupText(userGroup): string {
    return userGroup.usergroupuser_set
      .map((u) => u.user.first_name)
      .join(' + ');
  }

  isGroupFound(userGroup) {
    return true;
  }
}

import { Component, OnChanges, OnInit } from '@angular/core';
import { Group, TriadGroupingActivity } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-triad-grouping-activity',
  templateUrl: './triad-grouping-activity.component.html',
  styleUrls: ['./triad-grouping-activity.component.scss'],
})
export class MainScreenTriadGroupingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  triadAct: TriadGroupingActivity;
  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.triadAct = this.activityState.triadgroupingactivity;
  }

  ngOnChanges() {
    this.triadAct = this.activityState.triadgroupingactivity;
  }

  getGroupText(userGroup: Group): string {
    const participantCodes = this.getParticipantCodes(userGroup);
    participantCodes.sort((a, b) => a - b);
    const participantNames: Array<string> = [];
    participantCodes.forEach((pCode) => {
      participantNames.push(this.getParticipantName(pCode));
    });

    return participantNames.join(' + ');

    // userGroup.usergroupuser_set.sort((a, b) => a.user.first_name.localeCompare(b.user.first_name));
    // return userGroup.usergroupuser_set.map((u) => u.user.first_name).join(' + ');
  }

  isReversed(): boolean {
    return (
      this.activityState.roleplaypairactivity.reverse_group_activity !== null &&
      this.activityState.roleplaypairactivity.reverse_group_activity !== undefined
    );
  }

  isGroupFound(userGroup: Group): boolean {
    const lostUsers = userGroup.participantgroupstatus_set.filter((ug) => !ug.ready);
    if (lostUsers.length) {
      return false;
    } else {
      return true;
    }
  }
}

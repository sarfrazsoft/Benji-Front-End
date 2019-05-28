import { Component } from '@angular/core';
import { concat, remove } from 'lodash';
import { EmojiLookupService } from 'src/app/services';
import {
  GroupingUserFoundEvent,
  RoleplayPairUser,
  UserGroupUserSet
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-pair-grouping-activity',
  templateUrl: './pair-grouping-activity.component.html',
  styleUrls: ['./pair-grouping-activity.component.scss']
})
export class ParticipantPairGroupingActivityComponent extends BaseActivityComponent {
  partnerName: string;
  constructor(private emoji: EmojiLookupService) {
    super();
  }

  myGroup(): UserGroupUserSet {
    return this.activityState.pairgroupingactivity.usergroup_set.find(
      ug =>
        ug.usergroupuser_set
          .map(u => u.user.id)
          .indexOf(this.activityState.your_identity.id) > -1
    );
  }

  partnerText(): string {
    const myGroup = this.myGroup();
    const myGroupWithoutMe = remove(
      concat(myGroup.usergroupuser_set, []),
      e => e.user.id !== this.activityState.your_identity.id
    );
    if (myGroupWithoutMe.length === 1) {
      this.partnerName = myGroupWithoutMe[0].user.first_name;
      return 'Your partner is ' + this.partnerName;
    } else {
      this.partnerName =
        myGroupWithoutMe[0].user.first_name +
        ' and ' +
        myGroupWithoutMe[1].user.first_name;
      return (
        'Your partners are ' +
        myGroupWithoutMe[0].user.first_name +
        ' and ' +
        myGroupWithoutMe[1].user.first_name
      );
    }
  }

  myRoleplayUser(): RoleplayPairUser {
    const myGroup: UserGroupUserSet = this.myGroup();

    return myGroup.usergroupuser_set.find(
      g => g.user.id === this.activityState.your_identity.id
    );
  }

  participantIsReady(): boolean {
    return this.myRoleplayUser().found;
  }

  sendReadyState(): void {
    this.sendMessage.emit(new GroupingUserFoundEvent());
  }
}

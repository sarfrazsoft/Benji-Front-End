import { Component, OnChanges, OnInit } from '@angular/core';
import { concat, remove } from 'lodash';
import { ContextService, EmojiLookupService } from 'src/app/services';
import {
  GroupingUserFoundEvent,
  RoleplayPairUser,
  TriadRoleplayPairUser,
  TriadUserGroupUserSet,
  UserGroupUserSet,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-triad-grouping-activity',
  templateUrl: './triad-grouping-activity.component.html',
  styleUrls: ['./triad-grouping-activity.component.scss'],
})
export class ParticipantTriadGroupingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  partnerName: string;
  constructor(
    private emoji: EmojiLookupService,
    private contextService: ContextService
  ) {
    super();
  }

  ngOnInit() {}
  ngOnChanges() {
    const timer = this.activityState.triadgroupingactivity
      .grouping_countdown_timer;
    this.contextService.activityTimer = timer;
  }

  myGroup(): TriadUserGroupUserSet {
    return this.activityState.triadgroupingactivity.usergroup_set.find(
      (ug) =>
        ug.usergroupuser_set
          .map((u) => u.user.id)
          .indexOf(this.activityState.your_identity.id) > -1
    );
  }

  partnerText(): string {
    const myGroup = this.myGroup();
    const myGroupWithoutMe = remove(
      concat(myGroup.usergroupuser_set, []),
      (e) => e.user.id !== this.activityState.your_identity.id
    );
    myGroupWithoutMe.sort((a, b) =>
      a.user.first_name.localeCompare(b.user.first_name)
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

  myRoleplayUser(): TriadRoleplayPairUser {
    const myGroup: TriadUserGroupUserSet = this.myGroup();

    return myGroup.usergroupuser_set.find(
      (g) => g.user.id === this.activityState.your_identity.id
    );
  }

  participantIsReady(): boolean {
    return this.myRoleplayUser().found;
  }

  sendReadyState(): void {
    this.sendMessage.emit(new GroupingUserFoundEvent());
  }
}

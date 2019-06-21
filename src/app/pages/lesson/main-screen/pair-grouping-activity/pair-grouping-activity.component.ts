import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { EmojiLookupService } from 'src/app/services';
import { UserGroupUserSet } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-pair-grouping-activity',
  templateUrl: './pair-grouping-activity.component.html',
  styleUrls: ['./pair-grouping-activity.component.scss']
})
export class MainScreenPairGroupingActivityComponent extends BaseActivityComponent {
  constructor(private emoji: EmojiLookupService) {
    super();
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

  isGroupFound(userGroup: UserGroupUserSet): boolean {
    return !userGroup.usergroupuser_set.find(ug => !ug.found);
  }
}

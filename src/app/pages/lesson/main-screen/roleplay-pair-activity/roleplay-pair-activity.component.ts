import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { concat } from 'lodash';
import { EmojiLookupService } from 'src/app/services';
import { RoleplayPair } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-roleplay-pair-activity',
  templateUrl: './roleplay-pair-activity.component.html',
  styleUrls: ['./roleplay-pair-activity.component.scss']
})
export class MainScreenPairActivityComponent extends BaseActivityComponent {
  getGroupText(userGroup: RoleplayPair) {
    return concat(
      userGroup.primary_roleplayuser_set,
      userGroup.secondary_roleplayuser_set
    )
      .map(u => u.user.first_name)
      .join(' + ');
  }

  constructor(private emoji: EmojiLookupService) {
    super();
  }

  isReversed() {
    return (
      this.activityState.roleplaypairactivity.reverse_group_activity !== null &&
      this.activityState.roleplaypairactivity.reverse_group_activity !==
        undefined
    );
  }
}

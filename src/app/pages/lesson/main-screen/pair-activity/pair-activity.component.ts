import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { concat } from 'lodash';
import { EmojiLookupService } from 'src/app/services';
import { RoleplayPair } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-pair-activity',
  templateUrl: './pair-activity.component.html',
  styleUrls: ['./pair-activity.component.scss']
})
export class MainScreenPairActivityComponent extends BaseActivityComponent
  implements AfterViewInit {
  @ViewChild('pairTimer') pairTimer;
  @ViewChild('discussionTimer') discussionTimer;

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

  ngAfterViewInit() {
    if (
      !this.activityState.roleplaypairactivity.all_pairs_found &&
      !this.activityState.roleplaypairactivity.skip_pairing
    ) {
      const pairSeconds =
        (Date.parse(
          this.activityState.roleplaypairactivity.grouping_countdown_timer
            .end_time
        ) -
          Date.now()) /
        1000;
      this.pairTimer.startTimer(pairSeconds);
    }
  }

  isReversed() {
    return (
      this.activityState.roleplaypairactivity.reverse_group_activity !== null &&
      this.activityState.roleplaypairactivity.reverse_group_activity !==
        undefined
    );
  }
}

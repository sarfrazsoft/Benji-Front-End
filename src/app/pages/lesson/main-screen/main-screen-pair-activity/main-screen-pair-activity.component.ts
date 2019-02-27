import {
  Component,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { EmojiLookupService } from 'src/app/services/emoji-lookup.service';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import { concat } from 'lodash';
import { RoleplayPair } from '../../../../services/backend/schema/activities';

@Component({
  selector: 'app-main-screen-pair-activity',
  templateUrl: './main-screen-pair-activity.component.html',
  styleUrls: ['./main-screen-pair-activity.component.scss']
})
export class MainScreenPairActivityComponent extends BaseActivityComponent
  implements AfterViewInit {
  @ViewChild('pairTimer') pairTimer;
  @ViewChild('discussionTimer') discussionTimer;

  getGroupText(userGroup: RoleplayPair) {
    return concat(userGroup.primary_roleplayuser_set, userGroup.secondary_roleplayuser_set)
      .map(u => u.user.first_name)
      .join(' + ');
  }

  constructor(private emoji: EmojiLookupService) {
    super();
  }

  ngAfterViewInit() {
    if (!this.activityState.roleplaypairactivity.all_pairs_found) {
      const pairSeconds =
        (Date.parse(this.activityState.roleplaypairactivity.grouping_countdown_timer.end_time) -
          Date.now()) /
        1000;
      this.pairTimer.startTimer(pairSeconds);
    }
  }

  isReversed() {
    return (
      this.activityState.roleplaypairactivity.reverse_group_activity !== null &&
      this.activityState.roleplaypairactivity.reverse_group_activity !== undefined
    );
  }
}

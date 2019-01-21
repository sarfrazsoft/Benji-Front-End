import {
  Component,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';
import { EmojiLookupService } from 'src/app/services/emoji-lookup.service';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import { isEqual, concat } from 'lodash';
import { RoleplayUserGroup } from '../../../../services/backend/schema/activity';

@Component({
  selector: 'app-main-screen-pair-activity',
  templateUrl: './main-screen-pair-activity.component.html',
  styleUrls: ['./main-screen-pair-activity.component.scss']
})
export class MainScreenPairActivityComponent extends BaseActivityComponent
  implements AfterViewInit {
  @ViewChild('pairTimer') pairTimer;
  @ViewChild('discussionTimer') discussionTimer;

  getGroupText(userGroup: RoleplayUserGroup) {
    return concat(userGroup.primary, userGroup.secondary)
      .map(u => this.idToName(u))
      .join(' + ');
  }

  constructor(private emoji: EmojiLookupService) {
    super();
  }

  ngAfterViewInit() {
    if (!this.activityState.activity_status.all_pairs_found) {
      const pairSeconds =
        (Date.parse(this.activityState.activity_status.countdown_pair) -
          Date.now()) /
        1000;
      this.pairTimer.startTimer(pairSeconds);
    }
  }

  discussionTimerInit(timer) {
    const discussionTotalTime =
      Date.parse(this.activityState.activity_status.countdown_discussion) -
      Date.now();
    const discussionElapsedTime = 0;
    timer.startTimer(discussionTotalTime, discussionElapsedTime);
  }

  isReversed() {
    return (
      this.activityState.activity_status.activity_type ===
      'ReverseRoleplayPairActivity'
    );
  }

  isReady(userGroup: RoleplayUserGroup) {
    return (
      this.activityState.activity_status.groups_found.find(e =>
        isEqual(userGroup, e)
      ) !== undefined
    );
  }
}

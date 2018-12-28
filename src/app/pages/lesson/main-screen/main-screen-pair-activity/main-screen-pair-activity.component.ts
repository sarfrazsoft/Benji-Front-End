import {Component, OnInit, ViewChild, OnChanges, SimpleChanges} from '@angular/core';
import { EmojiLookupService } from 'src/app/services/emoji-lookup.service';
import {BaseActivityComponent} from '../../shared/base-activity.component';
import { isEqual, concat } from 'lodash';
import {RoleplayUserGroup} from '../../../../services/backend/schema/activity';

@Component({
  selector: 'app-main-screen-pair-activity',
  templateUrl: './main-screen-pair-activity.component.html',
  styleUrls: ['./main-screen-pair-activity.component.scss']
})
export class MainScreenPairActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {

  discussionTotalTime: number;
  discussionElapsedTime: number;
  discussionInterval;

  @ViewChild('pairTimer') pairTimer;
  pairSeconds: number;

  static getGroupText(userGroup: RoleplayUserGroup) {
    return concat(userGroup.primary, userGroup.secondary).join(' + ');
  }

  constructor(private emoji: EmojiLookupService) {
    super();
  }

  ngOnInit() {
    this.pairSeconds = (Date.parse(this.activityState.activity_status.countdown_pair) - Date.now()) / 1000;
    this.pairTimer.startTimer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activityState'] &&
                  (changes['activityState'].previousValue.activity_status.all_pairs_found !==
                  changes['activityState'].currentValue.activity_status.all_pairs_found) &&
                  changes['activityState'].currentValue.activity_status.all_pairs_found) {
      this.discussionTotalTime = Date.parse(this.activityState.activity_status.discussion_countdown_time) - Date.now();
      this.discussionElapsedTime = 0;
      this.discussionInterval = setInterval(() => {
        if (this.discussionElapsedTime < this.discussionTotalTime) {
          this.discussionElapsedTime += 100;
        } else {
          this.discussionElapsedTime = this.discussionTotalTime;
          clearInterval(this.discussionInterval);
        }
      });
    }
  }

  isReversed() {
    return this.activityState.activity_status.activity_type === 'ReverseRoleplayPairActivity';
  }

  isReady(userGroup: RoleplayUserGroup) {
    return this.activityState.activity_status.groups_found.find((e) => isEqual(userGroup, e)) !== undefined;
  }
}

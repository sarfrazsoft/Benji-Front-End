import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { RoleplayRole, Timer } from 'src/app/services/backend/schema';
import { EmojiLookupService } from 'src/app/services/emoji-lookup.service';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-generic-roleplay-activity',
  templateUrl: './generic-roleplay-activity.component.html',
  styleUrls: ['./generic-roleplay-activity.component.scss']
})
export class MainScreenGenericRoleplayActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  roles: Array<RoleplayRole>;
  giveFeedback = false;
  rplayTimer: Timer;
  feedbackTimer: Timer;

  constructor(private emoji: EmojiLookupService) {
    super();
  }

  ngOnInit() {
    // Don't reassign roles varialbe to prevent re-render of UI
    const act = this.activityState.genericroleplayactivity;
    this.roles = act.genericroleplayrole_set;
  }

  ngOnChanges() {
    const act = this.activityState.genericroleplayactivity;
    this.rplayTimer = act.activity_countdown_timer;

    if (this.rplayTimer.status !== 'ended') {
      this.giveFeedback = false;
    }

    this.feedbackTimer = act.feedback_countdown_timer;
    if (this.feedbackTimer && this.rplayTimer.status === 'ended') {
      this.giveFeedback = true;
    }
  }

  getFbackSubmittedCount() {
    const users = this.activityState.genericroleplayactivity
      .genericroleplayuser_set;
    const count = users.filter(user => user.feedback_submitted).length;
    return count;
  }

  getGroupUsersCount() {
    const roles = this.activityState.genericroleplayactivity
      .genericroleplayrole_set;
    const count = roles.filter(role => role.feedbackquestions.length).length;
    return count;
  }
}

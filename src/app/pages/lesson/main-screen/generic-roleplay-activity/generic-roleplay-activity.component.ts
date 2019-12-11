import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import {
  GenericRoleplayActivity,
  RoleplayRole,
  Timer
} from 'src/app/services/backend/schema';
import { EmojiLookupService } from 'src/app/services/emoji-lookup.service';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-generic-roleplay-activity',
  templateUrl: './generic-roleplay-activity.component.html',
  styleUrls: ['./generic-roleplay-activity.component.scss']
})
export class MainScreenGenericRoleplayActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges, OnDestroy {
  roles: Array<RoleplayRole>;
  giveFeedback = false;
  rplayTimer: Timer;
  feedbackTimer: Timer;
  timerInterval;

  constructor(private emoji: EmojiLookupService) {
    super();
  }

  ngOnChanges() {
    this.roles = this.activityState.genericroleplayactivity.genericroleplayrole_set;
    if (!this.giveFeedback) {
      this.setupTimer();
    }
  }

  ngOnInit() {
    this.timerInterval = setInterval(() => this.checkTimer(), 100);
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  setupTimer() {
    const actTimer: Timer = this.activityState.genericroleplayactivity
      .activity_countdown_timer;
    const fbackBuffer = this.activityState.genericroleplayactivity
      .feedback_buffer;

    this.rplayTimer = {
      id: actTimer.id,
      status: actTimer.status,
      start_time: actTimer.start_time,
      end_time: moment(actTimer.end_time)
        .subtract(fbackBuffer, 'seconds')
        .format(),
      remaining_seconds: actTimer.remaining_seconds - fbackBuffer,
      total_seconds: actTimer.total_seconds - fbackBuffer
    };
  }

  checkTimer() {
    const actTimer: Timer = this.activityState.genericroleplayactivity
      .activity_countdown_timer;
    const fbackBuffer = this.activityState.genericroleplayactivity
      .feedback_buffer;

    if (
      moment(this.rplayTimer.end_time).isSameOrBefore(moment()) ||
      actTimer.remaining_seconds - fbackBuffer <= 0
    ) {
      this.giveFeedback = true;
      this.feedbackTimer = {
        id: actTimer.id,
        status: actTimer.status,
        start_time: moment().format(),
        end_time: actTimer.end_time,
        remaining_seconds: actTimer.remaining_seconds,
        total_seconds: fbackBuffer
      };
    }
  }

  getFbackSubmittedCount() {
    return '0';
  }

  getGroupUsersCount() {
    return '0';
  }
}

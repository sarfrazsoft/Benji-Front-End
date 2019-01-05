import {Component} from '@angular/core';
import {BaseActivityComponent} from '../../shared/base-activity.component';
import {RoleplayUserGroup} from '../../../../services/backend/schema/activity';

@Component({
  selector: 'app-participant-discussion-activity',
  templateUrl: './participant-discussion-activity.component.html',
  styleUrls: ['./participant-discussion-activity.component.scss']
})
export class ParticipantDiscussionActivityComponent extends BaseActivityComponent {

  presenterGroupToList(presenterGroup: RoleplayUserGroup) {
    return presenterGroup.primary.concat(presenterGroup.secondary);
  }

  currentPresenterGroup() {
    return this.activityState.activity_status.selected_sharers[this.activityState.activity_status.sharer_group_num];
  }

  participantVolunteered() {
    return this.activityState.activity_status.sharers.indexOf(this.activityState.your_identity.id) > -1;
  }

  participantIsSharing() {
    if (this.currentPresenterGroup() === undefined) {
      return false;
    }
    return this.presenterGroupToList(this.currentPresenterGroup()).indexOf(this.activityState.your_identity.id) > -1;
  }

  shareButton() {
    if (!this.participantVolunteered()) {
      this.sendMessage.emit({'event': 'share_button'});
    }
  }

  doneButton() {
    this.sendMessage.emit({'event': 'done_button'});
  }

  discussionTimerInit(timer) {
    const discussionTotalTime = Date.parse(this.activityState.activity_status.discussion_countdown_time) - Date.now();
    timer.startTimer(discussionTotalTime);
  }

  sharingTimerInit(timer) {
    const timeStr = this.activityState.activity_status.sharer_countdown_time[this.activityState.activity_status.sharer_group_num];
    const sharingTotalTime = Date.parse(timeStr) - Date.now();
    timer.startTimer(sharingTotalTime);
  }
}

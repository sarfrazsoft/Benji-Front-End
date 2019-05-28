import { Component } from '@angular/core';
import {
  DiscussionSharerDoneEvent,
  DiscussionSharingVolunteerEvent
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-discussion-activity',
  templateUrl: './discussion-activity.component.html',
  styleUrls: ['./discussion-activity.component.scss']
})
export class ParticipantDiscussionActivityComponent extends BaseActivityComponent {
  participantVolunteered() {
    return (
      this.activityState.discussionactivity.discussiongroup_set.find(
        g =>
          g.discussiongroupmember_set.find(
            m =>
              m.has_volunteered &&
              m.user.id === this.activityState.your_identity.id
          ) !== undefined
      ) !== undefined
    );
  }

  participantIsSharing() {
    return (
      this.activityState.discussionactivity.currently_sharing_group.discussiongroupmember_set.find(
        m => m.user.id === this.activityState.your_identity.id
      ) !== undefined
    );
  }

  shareButton() {
    if (!this.participantVolunteered()) {
      this.sendMessage.emit(new DiscussionSharingVolunteerEvent());
    }
  }

  doneButton() {
    this.sendMessage.emit(new DiscussionSharerDoneEvent());
  }

  discussionTimerInit(timer) {
    const discussionTotalTime =
      Date.parse(
        this.activityState.discussionactivity.discussion_countdown_timer
          .end_time
      ) - Date.now();
    timer.startTimer(discussionTotalTime);
  }

  sharingTimerInit(timer) {
    const timeStr = this.activityState.discussionactivity
      .currently_sharing_group.sharing_countdown_timer.end_time;
    const sharingTotalTime = Date.parse(timeStr) - Date.now();
    timer.startTimer(sharingTotalTime);
  }
}
import { Component, OnChanges, OnInit } from '@angular/core';
import {
  DiscussionActivity,
  DiscussionSharerDoneEvent,
  DiscussionSharingVolunteerEvent,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-discussion-activity',
  templateUrl: './discussion-activity.component.html',
  styleUrls: ['./discussion-activity.component.scss'],
})
export class ParticipantDiscussionActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  act: DiscussionActivity;
  questions = [];
  ngOnInit() {}

  ngOnChanges() {
    this.act = this.activityState.discussionactivity;
    if (this.act.currently_sharing_group) {
      if (this.act.currently_sharing_group.notes) {
        this.questions = this.act.currently_sharing_group.notes;
      }
    }
  }

  participantVolunteered() {
    return (
      this.activityState.discussionactivity.discussiongroup_set.find(
        (g) =>
          g.discussiongroupmember_set.find(
            (m) =>
              m.has_volunteered &&
              m.user.id === this.activityState.your_identity.id
          ) !== undefined
      ) !== undefined
    );
  }

  participantIsSharing() {
    return (
      this.activityState.discussionactivity.currently_sharing_group.discussiongroupmember_set.find(
        (m) => m.user.id === this.activityState.your_identity.id
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
}

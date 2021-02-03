import { Component, OnChanges, OnInit } from '@angular/core';
import { ContextService } from 'src/app/services';
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

  discussionStage = false;
  shareWithGroup = false;
  listeningGroup = false;
  constructor(private contextService: ContextService) {
    super();
  }
  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges() {
    this.act = this.activityState.discussionactivity;
    if (this.act.currently_sharing_group) {
      if (this.act.currently_sharing_group.notes) {
        this.questions = this.act.currently_sharing_group.notes;
      }
    }

    if (!this.act.discussion_complete) {
      this.discussionStage = true;
      this.shareWithGroup = false;
      this.listeningGroup = false;
      this.contextService.activityTimer = this.act.discussion_countdown_timer;
    } else if (this.act.discussion_complete && this.participantIsSharing()) {
      this.shareWithGroup = true;
      this.discussionStage = false;
      this.listeningGroup = false;
      const timer = this.act.currently_sharing_group.sharing_countdown_timer;
      this.contextService.activityTimer = timer;
    } else if (this.act.discussion_complete && !this.participantIsSharing()) {
      this.shareWithGroup = false;
      this.discussionStage = false;
      this.listeningGroup = true;
    }
  }

  participantVolunteered() {
    return (
      this.activityState.discussionactivity.discussiongroup_set.find(
        (g) =>
          g.discussiongroupmember_set.find(
            (m) => m.has_volunteered && m.participant.participant_code === this.getParticipantCode()
          ) !== undefined
      ) !== undefined
    );
  }

  participantIsSharing() {
    return (
      this.activityState.discussionactivity.currently_sharing_group.discussiongroupmember_set.find(
        (m) => m.participant.participant_code === this.getParticipantCode()
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

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {BaseActivityComponent} from '../../shared/base-activity.component';
import {RoleplayUserGroup} from '../../../../services/backend/schema/activity';

@Component({
  selector: 'app-participant-discussion-activity',
  templateUrl: './participant-discussion-activity.component.html',
  styleUrls: ['./participant-discussion-activity.component.scss']
})
export class ParticipantDiscussionActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {

  discussionTotalTime: number;
  @ViewChild('discussionTimer') discussionTimer;

  sharingTotalTime: number;
  @ViewChild('sharingTimer') sharingTimer;

  static presenterGroupToList(presenterGroup: RoleplayUserGroup) {
    return presenterGroup.primary.concat(presenterGroup.secondary);
  }

  currentPresenterGroup() {
    return this.activityState.activity_status.selected_sharers[this.activityState.activity_status.sharer_group_num];
  }

  participantVolunteered() {
    return this.activityState.activity_status.sharers.indexOf(this.activityState.your_identity.id) > -1;
  }

  participantIsSharing() {
    return ParticipantDiscussionActivityComponent.presenterGroupToList(
            this.currentPresenterGroup()).indexOf(this.activityState.your_identity.id) > -1;
  }

  shareButton() {
    if (!this.participantVolunteered()) {
      this.sendMessage.emit({'event': 'share_button'});
    }
  }

  doneButton() {
    this.sendMessage.emit({'event': 'done_button'});
  }

  ngOnInit() {
    this.discussionTotalTime = Date.parse(this.activityState.activity_status.discussion_countdown_time) - Date.now();
    this.discussionTimer.startTimer();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['activityState'] &&
      (changes['activityState'].previousValue.activity_status.sharer_group_num !==
        changes['activityState'].currentValue.activity_status.sharer_group_num) &&
      changes['activityState'].currentValue.activity_status.sharer_group_num !== null) {
      if (this.participantIsSharing()) {
        const timeStr = this.activityState.activity_status.sharer_countdown_time[this.activityState.activity_status.sharer_group_num];
        this.sharingTotalTime = Date.parse(timeStr) - Date.now();
        this.sharingTimer.startTimer();
      }
    }
  }
}

import {Component, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import { EmojiLookupService } from '../../../../services/emoji-lookup.service';
import {BaseActivityComponent} from '../../shared/base-activity.component';
import { concat, remove } from 'lodash';

@Component({
  selector: 'app-participant-pair-activity',
  templateUrl: './participant-pair-activity.component.html',
  styleUrls: ['./participant-pair-activity.component.scss']
})
export class ParticipantPairActivityComponent extends BaseActivityComponent {
  constructor(private emoji: EmojiLookupService) {
    super();
  }

  roleplayTimerStart(timer) {
    const roleSeconds = (Date.parse(this.activityState.activity_status.discussion_countdown_time) - Date.now()) / 1000;
    timer.startTimer(roleSeconds);
  }

  partnerText() {
    const myGroup = this.activityState.activity_status.user_groups.find((ug) =>
                        concat(ug.primary, ug.secondary).indexOf(this.activityState.your_identity.id) > -1);
    const myGroupWithoutMe = remove(concat(myGroup.primary, myGroup.secondary), (e) => e !== this.activityState.your_identity.id);
    if (myGroupWithoutMe.length === 1) {
      return 'Your partner is ' + this.idToName(myGroupWithoutMe[0]);
    } else {
      return 'Your partners are ' + this.idToName(myGroupWithoutMe[0]) + ' and ' + this.idToName(myGroupWithoutMe[1]);
    }
  }

  participantIsPrimary() {
    return this.activityState.activity_status.user_groups.find((ug) =>
      ug.primary.indexOf(this.activityState.your_identity.id) > -1) !== undefined;
  }

  participantIsReady() {
    return this.activityState.activity_status.user_pairs_found.indexOf(this.activityState.your_identity.id) > -1;
  }

  getParticipantRole() {
    if (this.participantIsPrimary()) {
      return this.activityState.activity_status.primary_role;
    } else {
      return this.activityState.activity_status.secondary_role;
    }
  }

  sendReadyState() {
    this.sendMessage.emit({ 'event': 'pair_found' });
  }

}

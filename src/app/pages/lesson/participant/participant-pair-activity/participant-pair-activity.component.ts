import { Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { EmojiLookupService } from '../../../../services/emoji-lookup.service';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import { concat, remove } from 'lodash';
import {RoleplayPairUserFoundEvent} from '../../../../services/backend/schema/messages';

@Component({
  selector: 'app-participant-pair-activity',
  templateUrl: './participant-pair-activity.component.html',
  styleUrls: ['./participant-pair-activity.component.scss']
})
export class ParticipantPairActivityComponent extends BaseActivityComponent {
  partnerName: string;

  constructor(private emoji: EmojiLookupService) {
    super();
  }

  roleplayTimerStart(timer) {
    const roleSeconds =
      (Date.parse(
        this.activityState.roleplaypairactivity.activity_countdown_timer.expiration_time
      ) -
        Date.now()) /
      1000;
    timer.startTimer(roleSeconds);
  }

  myGroup() {
    return this.activityState.roleplaypairactivity.roleplaypair_set.find(
      ug =>
        concat(ug.primary_roleplayuser_set, ug.secondary_roleplayuser_set).map(
          u => u.user.id ).indexOf(
          this.activityState.your_identity.id
        ) > -1
    );
  }

  partnerText() {
    const myGroup = this.myGroup();
    const myGroupWithoutMe = remove(
      concat(myGroup.primary_roleplayuser_set, myGroup.secondary_roleplayuser_set),
      e => e.user.id !== this.activityState.your_identity.id
    );
    if (myGroupWithoutMe.length === 1) {
      this.partnerName = myGroupWithoutMe[0].user.first_name;
      return 'Your partner is ' + this.partnerName;
    } else {
      this.partnerName =
        myGroupWithoutMe[0].user.first_name +
        ' and ' +
        myGroupWithoutMe[1].user.first_name;
      return (
        'Your partners are ' +
        myGroupWithoutMe[0].user.first_name +
        ' and ' +
        myGroupWithoutMe[1].user.first_name
      );
    }
  }

  myRoleplayUser() {
    const myGroup = this.myGroup();
    return concat(myGroup.primary_roleplayuser_set, myGroup.secondary_roleplayuser_set).find(
      g => g.user.id === this.activityState.your_identity.id);
  }

  participantIsPrimary() {
    return this.myGroup().primary_roleplayuser_set.find(
      g => g.user.id === this.activityState.your_identity.id) !== undefined;
  }

  participantIsReady() {
    return this.myRoleplayUser().found;
  }

  getParticipantRole() {
    if (this.participantIsPrimary()) {
      return this.activityState.roleplaypairactivity.primary_role;
    } else {
      return this.activityState.roleplaypairactivity.secondary_role;
    }
  }

  sendReadyState() {
    this.sendMessage.emit(new RoleplayPairUserFoundEvent());
  }
}

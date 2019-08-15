import {
  animate,
  state,
  style,
  transition,
  trigger
  // ...
} from '@angular/animations';
import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { zoomInAnimation } from 'angular-animations';
import { concat, remove } from 'lodash';
import { EmojiLookupService } from 'src/app/services';
import { RoleplayPairUserFoundEvent } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-pair-activity',
  templateUrl: './pair-activity.component.html',
  styleUrls: ['./pair-activity.component.scss'],
  animations: [zoomInAnimation()]
})
export class ParticipantPairActivityComponent extends BaseActivityComponent
  implements OnInit, OnDestroy {
  partnerName: string;

  timerInterval;
  timer;
  animationState = false;
  animationWithState = false;

  constructor(private emoji: EmojiLookupService, private dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    // this.timer = 1;
    // this.timerInterval = setInterval(() => this.showAttentionDialog(), 1000);
  }

  showAttentionDialog() {
    this.timer = this.timer + 1;
    this.animate();
  }

  animate() {
    this.animationState = false;
    setTimeout(() => {
      this.animationState = true;
      this.animationWithState = !this.animationWithState;
    }, 1);
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  myGroup() {
    return this.activityState.roleplaypairactivity.roleplaypair_set.find(
      ug =>
        concat(ug.primary_roleplayuser_set, ug.secondary_roleplayuser_set)
          .map(u => u.user.id)
          .indexOf(this.activityState.your_identity.id) > -1
    );
  }

  partnerText() {
    const myGroup = this.myGroup();
    const myGroupWithoutMe = remove(
      concat(
        myGroup.primary_roleplayuser_set,
        myGroup.secondary_roleplayuser_set
      ),
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
    return concat(
      myGroup.primary_roleplayuser_set,
      myGroup.secondary_roleplayuser_set
    ).find(g => g.user.id === this.activityState.your_identity.id);
  }

  participantIsPrimary() {
    return (
      this.myGroup().primary_roleplayuser_set.find(
        g => g.user.id === this.activityState.your_identity.id
      ) !== undefined
    );
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

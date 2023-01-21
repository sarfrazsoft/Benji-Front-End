import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { toInteger } from 'lodash';
import { ActivitiesService } from 'src/app/services/activities';
import { EventTypes, UpdateMessage } from 'src/app/services/backend/schema';
@Component({
  selector: 'benji-profile-pictures',
  templateUrl: './benji-profile-pictures.component.html',
})
export class BenjiProfilePicturesComponent implements OnInit, OnChanges {
  @Input() participantCodes: number[];
  @Input() activityState: UpdateMessage;
  @Input() counterAfter: number;
  @Input() showTooltip = true;
  @Input() size: string;
  @Input() name: string;

  remainingCount = 0;
  displayCodes: [];

  names = [];
  initials = [];

  constructor(private activitiesService: ActivitiesService) {}

  ngOnInit(): void {
    // this.activityState = this.activityState;
    this.setupNames();
  }

  setupNames() {
    this.names = [];
    this.initials = [];

    for (let i = 0; i < this.participantCodes.length; i++) {
      const participantCode = this.participantCodes[i];
      this.names.push(this.activitiesService.getParticipantName(this.activityState, participantCode));
      this.initials.push(this.getInitials(participantCode));
    }
  }

  ngOnChanges(): void {
    if (this.participantCodes && this.participantCodes.length > this.counterAfter) {
      this.remainingCount = this.participantCodes.length - this.counterAfter;
      this.participantCodes = this.participantCodes.slice(0, this.counterAfter);
    } else {
      this.remainingCount = 0;
    }

    if (this.activityState && this.activityState.eventType === EventTypes.joinEvent) {
      // only update activity state when join event occurs
      this.setupNames();
    }
  }

  getName(code: number) {
    const name = this.activitiesService.getParticipantName(this.activityState, code);
    return name;
  }

  getInitials(code: number) {
    let nameString = '';

    nameString = this.activitiesService.getParticipantName(this.activityState, code);

    const fullName = this.name ? this.name.split(' ') : nameString.split(' ');
    const first = fullName[0] ? fullName[0].charAt(0) : '';
    if (fullName.length === 1) {
      return first.toUpperCase();
    }
    const second = fullName[fullName.length - 1] ? fullName[fullName.length - 1].charAt(0) : '';

    return (first + second).toUpperCase();
  }

  getColorIndex(code: number) {
    const lastTwo = String(code % 100);
    const index = toInteger(lastTwo[0]) + toInteger(lastTwo[1]);
    return index;
  }
}

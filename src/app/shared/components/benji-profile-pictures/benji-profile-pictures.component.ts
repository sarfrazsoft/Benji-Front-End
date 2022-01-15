import { Component, Input, OnInit } from '@angular/core';
import { toInteger } from 'lodash';
import { ActivitiesService } from 'src/app/services/activities';
import { UpdateMessage } from 'src/app/services/backend/schema';
@Component({
  selector: 'benji-profile-pictures',
  templateUrl: './benji-profile-pictures.component.html',
})
export class BenjiProfilePicturesComponent implements OnInit {
  @Input() participantCodes: [];
  @Input() activityState: UpdateMessage;

  // initials: string [];
  // colorIndexes: number [];

  constructor(private activitiesService: ActivitiesService) {}

  ngOnInit(): void {
    // this.participantCodes.forEach(code => {
    //   this.initials.push(this.getInitials(code));
    //   this.colorIndexes.push(this.getColorIndex(code));
    // });
  }

  getInitials(code: number) {
    const nameString = this.activitiesService.getParticipantName(this.activityState, code);
    const fullName = nameString.split(' ');
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

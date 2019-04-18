import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-participant-build-pitch-activity',
  templateUrl: './participant-build-pitch-activity.component.html',
  styleUrls: ['./participant-build-pitch-activity.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParticipantBuildPitchActivityComponent
  extends BaseActivityComponent
  implements OnInit {
  createPitch = true;
  formValid = false;
  pitchSubmitted = false;
  voteNow = false;

  selectedUser = {};

  users = [
    {
      id: 1,
      name: 'Harold',
      pitch:
        'wing their businesses by providing funding because we want good ideas to succeed.'
    },
    {
      id: 2,
      name: 'Farah',
      pitch:
        'Georgian Partners helps <em>growth-stage software companies</em> with <em>growing their businesses</ em> by <em>providing funding</em> because <em>we want good ideas to succeed</em>.'
    }
  ];
  constructor() {
    super();
  }

  ngOnInit() {}

  userSelected($event) {
    console.log($event);
    this.selectedUser = $event;
  }
}

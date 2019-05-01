import { Component, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import {
  BuildAPitchActivity,
  BuildAPitchSubmitEventEntry,
  BuildAPitchSubmitPitchEvent
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-build-pitch-activity',
  templateUrl: './build-pitch-activity.component.html',
  styleUrls: ['./build-pitch-activity.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParticipantBuildPitchActivityComponent
  extends BaseActivityComponent
  implements OnInit {
  builtPitch_set;
  createPitch = true;
  pitchValid = false;
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
        'Georgian Partners helps <em>growth-stage software companies</em>' +
        ' with <em>growing their businesses</ em> by <em>providing funding</em>' +
        ' because <em>we want good ideas to succeed</em>.'
    }
  ];
  constructor() {
    super();
    this.builtPitch_set = [];
  }

  ngOnInit() {
    // how about we make the list of objects that
    // we are submitting to BE and each node can have an NgModel
    this.builtPitch_set = [];

    this.activityState.buildapitchactivity.buildapitchblank_set.forEach(v => {
      this.builtPitch_set.push({ ...v, ...{ value: null } });
    });
  }

  checkValidity() {
    this.pitchValid = true;
    for (let i = 0; i < this.builtPitch_set.length; i++) {
      const element = this.builtPitch_set[i];
      if (this.builtPitch_set[i] === null || this.builtPitch_set[i] === '') {
        this.pitchValid = false;
      }
    }
  }

  submitPitch() {
    const buildapitchsubmissionentry_set = [];
    this.builtPitch_set.forEach(p => {
      const buildAPitchSubmitEventEntry = new BuildAPitchSubmitEventEntry(
        p,
        p.value
      );
      buildapitchsubmissionentry_set.push(buildAPitchSubmitEventEntry);
    });

    this.sendMessage.emit(
      new BuildAPitchSubmitPitchEvent(buildapitchsubmissionentry_set)
    );
  }

  userSelected($event) {
    console.log($event);
    this.selectedUser = $event;
  }
}

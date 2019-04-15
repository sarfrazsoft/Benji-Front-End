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
  formValid = false;
  constructor() {
    super();
  }

  ngOnInit() {}
}

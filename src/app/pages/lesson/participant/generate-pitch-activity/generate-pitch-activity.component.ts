import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-generate-pitch-activity',
  templateUrl: './generate-pitch-activity.component.html',
  styleUrls: ['./generate-pitch-activity.component.scss']
})
export class ParticipantGeneratePitchActivityComponent
  extends BaseActivityComponent
  implements OnInit {
  shareFeedback = true;
  constructor() {
    super();
  }

  ngOnInit() {}
}

import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-main-screen-build-pitch-activity',
  templateUrl: './main-screen-build-pitch-activity.component.html',
  styleUrls: ['./main-screen-build-pitch-activity.component.scss']
})
export class MainScreenBuildPitchActivityComponent extends BaseActivityComponent
  implements OnInit {
  constructor() {
    super();
  }
  createPitches = false;
  sharePitches = true;
  voteNow = false;
  votesComplete = false;

  ngOnInit() {}
}

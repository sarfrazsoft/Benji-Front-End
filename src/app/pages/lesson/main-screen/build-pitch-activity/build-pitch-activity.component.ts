import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-build-pitch-activity',
  templateUrl: './build-pitch-activity.component.html',
  styleUrls: ['./build-pitch-activity.component.scss']
})
export class MainScreenBuildPitchActivityComponent extends BaseActivityComponent
  implements OnInit {
  statement: string;
  constructor() {
    super();
  }
  createPitches = true;
  sharePitches = false;
  voteNow = false;
  votesComplete = false;

  ngOnInit() {
    const blanks = this.activityState.buildapitchactivity.buildapitchblank_set;
    this.statement = '';
    blanks.forEach(b => {
      this.statement =
        this.statement + b.label + ' <em>(' + b.temp_text + ')</em> ';
    });
    console.log(this.statement);
  }
}

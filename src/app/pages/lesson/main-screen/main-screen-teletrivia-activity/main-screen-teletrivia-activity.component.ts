import { Component, OnChanges } from '@angular/core';
import { orderBy, sortBy } from 'lodash';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'app-mainscreen-activity-teletrivia',
  templateUrl: './main-screen-teletrivia-activity.component.html',
  styleUrls: ['./main-screen-teletrivia-activity.component.scss']
})
export class MainScreenTeletriviaActivityComponent extends BaseActivityComponent
  implements OnChanges {
  timerInit(timer) {
    const totalTime =
      Date.parse(this.activityState.activity_status.circle_countdown) -
      Date.now();
    const circleTimerSecondsElapsed = 0;
    timer.startTimer(totalTime, circleTimerSecondsElapsed);
  }

  ngOnChanges() {
    console.log(this.activityState.activity_status.circle_countdown);
    this.activityState.activity_status.leaderboard = orderBy(
      this.activityState.activity_status.leaderboard,
      ['correct'],
      ['desc']
    );
  }

  radialTimeUp($event) {
    console.log('heelo');
  }
}

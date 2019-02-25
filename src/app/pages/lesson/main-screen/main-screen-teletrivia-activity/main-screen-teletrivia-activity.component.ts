import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'app-mainscreen-activity-teletrivia',
  templateUrl: './main-screen-teletrivia-activity.component.html',
  styleUrls: ['./main-screen-teletrivia-activity.component.scss']
})
export class MainScreenTeletriviaActivityComponent extends BaseActivityComponent {
  timerInit(timer) {
    const totalTime =
      Date.parse(this.activityState.teletriviaactivity.circle_countdown_timer.expiration_time) -
      Date.now();
    const circleTimerSecondsElapsed = 0;
    timer.startTimer(totalTime, circleTimerSecondsElapsed);
  }
}

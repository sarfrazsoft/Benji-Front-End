import { Component, OnInit, OnDestroy } from '@angular/core';
import {BaseActivityComponent} from '../../shared/base-activity.component';

@Component({
  selector: 'app-mainscreen-activity-teletrivia',
  templateUrl: './main-screen-teletrivia-activity.component.html',
  styleUrls: ['./main-screen-teletrivia-activity.component.scss']
})
export class MainScreenTeletriviaActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy {
  circleTimerSecondsElapsed: number;
  interval;
  totalSeconds;

  ngOnInit() {
    this.totalSeconds = (Date.parse(this.activityState.activity_status.circle_countdown) - Date.now()) / 1000;
    this.circleTimerSecondsElapsed = 0;
    this.interval = setInterval(() => {
      this.circleTimerSecondsElapsed++;
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}

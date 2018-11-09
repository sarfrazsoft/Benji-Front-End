import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-radial-timer',
  templateUrl: './radial-timer.component.html',
  styleUrls: [],
  // encapsulation: ViewEncapsulation.None
})

export class RadialTimerComponent {
  @Input() endStateText: string;
  public timesUp: boolean;


  getTimer(cd, max_timer) {
    const seconds_remain = max_timer - cd;
    const min = Math.floor( seconds_remain / 60);
    const sec = seconds_remain - 60 * min;

    if (min < 0) {
      return {'min': 0, 'sec': 0};
    } else {
      return {'min': min, 'sec': sec};
    }
  }

  _secondsElapsed = 100;
  _totalSeconds = 100;

  @Input()
  set secondsElapsed(secondsElapsed: number) {
    this._secondsElapsed = secondsElapsed;
    this.val();
  }

  @Input()
  set totalSeconds(totalSeconds: number) {
    this._totalSeconds = totalSeconds;
    // this.val();
    this.timesUp = false;
  }


  v = 100;

  constructor() { }

  val() {
    const val = (100 * (this._totalSeconds - this._secondsElapsed) / this._totalSeconds);
    if (!Number.isNaN(val) && val >= 0 && val <= 100) {
      this.v = val;
      if (this.v < 1) {
        setTimeout(() => {
          this.timesUp = true;
          this.v = 100;
        }, 100);
      }

    }
  }


}

/*
<h1 class="welcome-screen-text dark-blue">{{ getTimer(thinkCountdown, activityDetails.thinkpairshareactivity.think_timer).min | number:'1.0-0'}}:{{ getTimer(thinkCountdown, activityDetails.thinkpairshareactivity.think_timer).sec | number:'2.0-0' }}</h1>
 */

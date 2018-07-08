import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-radial-timer',
  template:
    '<ons-progress-circular [value]="v"></ons-progress-circular>',
})

export class RadialTimerComponent {
  _secondsRemain = 100;
  _totalSeconds = 100;

  @Input()
  set secondsRemain(secondsRemain: number) {
    this._secondsRemain = secondsRemain;
    this.val();
  }

  @Input()
  set totalSeconds(totalSeconds: number) {
    this._totalSeconds = totalSeconds;
    this.val();
  }

  v = 100;

  constructor() { }

  val() {
    this.v = Math.ceil(100 * this.secondsRemain / this.totalSeconds);
  }
}

/*
<h1 class="welcome-screen-text dark-blue">{{ getTimer(thinkCountdown, activityDetails.thinkpairshareactivity.think_timer).min | number:'1.0-0'}}:{{ getTimer(thinkCountdown, activityDetails.thinkpairshareactivity.think_timer).sec | number:'2.0-0' }}</h1>
 */

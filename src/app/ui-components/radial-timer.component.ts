import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-radial-timer',
  template:
    '<div class="timer-container">' +
    '  <div class="timer-svg">' +
    '    <ons-progress-circular style="width: 250px; height: 250px" modifier="blue" [value]="v"></ons-progress-circular>' +
    '  </div>' +
    '  <div class="timer-centered number-text" style="color: #1248F2">{{ getTimer(_secondsElapsed, _totalSeconds).min | number:\'1.0-0\'}}:{{ getTimer(_secondsElapsed, _totalSeconds).sec | number:\'2.0-0\' }}</div>' +
    '</div>',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class RadialTimerComponent {
  getTimer(cd, max_timer) {
    const seconds_remain = max_timer - cd;
    const min = Math.floor( seconds_remain / 60);
    const sec = seconds_remain - 60 * min;
    return {'min': min, 'sec': sec};
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
    this.val();
  }

  v = 100;

  constructor() { }

  val() {
    this.v = Math.ceil(100 * (this._totalSeconds - this._secondsElapsed) / this._totalSeconds);
  }


}

/*
<h1 class="welcome-screen-text dark-blue">{{ getTimer(thinkCountdown, activityDetails.thinkpairshareactivity.think_timer).min | number:'1.0-0'}}:{{ getTimer(thinkCountdown, activityDetails.thinkpairshareactivity.think_timer).sec | number:'2.0-0' }}</h1>
 */

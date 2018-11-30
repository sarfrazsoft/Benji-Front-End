import {Component, Input, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-radial-timer',
  templateUrl: './radial-timer.component.html',
  styleUrls: [],
  // encapsulation: ViewEncapsulation.None
})

export class RadialTimerComponent {
  @Input() endStateText: string;
  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;

  public timesUp: boolean;
  public soundIterationCount;


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
    this.soundIterationCount = undefined;
    // this.val();
    // this.timesUp = false;
  }


  v = 100;

  constructor() { }

  val() {
    const val = (100 * (this._totalSeconds - this._secondsElapsed) / this._totalSeconds);
    const remainingTime = (this._totalSeconds - this._secondsElapsed);

    if (Math.floor(remainingTime) === 0) {
      this.endSfx();
    }

    if (!Number.isNaN(val) && val >= 0 && val <= 100) {
      this.v = val;
      if (Math.floor(this.v) === 0) {
        setTimeout(() => {
          this.timesUp = true;
          this.v = 100;
        }, 100);
      } else {
        this.timesUp = false;
      }

    }
  }

  private endSfx() {
    this.sfxPlayer.nativeElement.play();
  }


}



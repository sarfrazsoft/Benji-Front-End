import {Component, Input, Output, ViewChild, ElementRef, OnInit, EventEmitter, OnDestroy} from '@angular/core';
import {init} from 'protractor/built/launcher';
import {Timer} from '../../services/backend/schema/utils';

@Component({
  selector: 'app-radial-timer',
  templateUrl: './radial-timer.component.html',
  styleUrls: [],
  // encapsulation: ViewEncapsulation.None
})

export class RadialTimerComponent implements OnInit, OnDestroy {
  @Input() endStateText: string;
  @Input() timer: Timer;

  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;

  totalTime: number;
  remainingTime: number;

  timerInterval;

  ngOnInit() {
    this.timerInterval = setInterval(() => this.update(), 100);
  }

  update() {
    if (this.timer) {
      this.totalTime = this.timer.total_seconds * 1000;

      if (this.timer.status === 'paused' ||
            this.timer.status === 'cancelled' ||
            this.timer.status === 'ended') {
        this.remainingTime = this.timer.remaining_seconds * 1000;
      } else {
        this.remainingTime = Date.parse(this.timer.end_time) - Date.now();
        if (this.remainingTime < 0) {
          this.remainingTime = 0;
        }
      }
    } else {
      this.totalTime = 1;
      this.remainingTime = 0;
    }
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }


  get_min_sec() {
    const secondsRemaining = Math.floor(this.remainingTime / 1000);
    const min = Math.floor( secondsRemaining / 60);
    const sec = secondsRemaining - 60 * min;

    if (min < 0) {
      return {'min': 0, 'sec': 0};
    } else {
      return {'min': min, 'sec': sec};
    }
  }

  pctRemaining() {
    return 100 * this.remainingTime / this.totalTime;
  }

  private endSfx() {
    this.sfxPlayer.nativeElement.play();
  }


}



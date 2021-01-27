import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Hammer } from 'hammerjs';
import * as moment from 'moment';
import { Timer } from '../../services/backend/schema';

@Component({
  selector: 'benji-linear-timer',
  templateUrl: './linear-timer.component.html',
  styleUrls: ['./linear-timer.component.scss'],
})
export class LinearTimerComponent implements OnInit, OnDestroy {
  constructor() {}
  @Input() endAudio;
  @Input() timer: Timer;
  @Input() timerOffset: number;
  @Input() classes: string;
  @Input() attentionOverlay = false;

  totalTime: number;
  remainingTime: number;

  timerInterval;
  audioStarted = false;
  showAttentionTimer = false;

  ngOnInit() {
    this.timerInterval = setInterval(() => this.update(), 100);
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  update() {
    if (this.timer) {
      this.totalTime = this.timer.total_seconds * 1000;
      if (
        this.timer.status === 'paused' ||
        this.timer.status === 'cancelled' ||
        this.timer.status === 'ended'
      ) {
        this.remainingTime = this.timer.remaining_seconds * 1000;
      } else {
        let offset;
        if (this.timerOffset !== null && this.timerOffset !== undefined) {
          offset = this.timerOffset;
        } else {
          offset = 0;
        }

        this.remainingTime = moment(this.timer.end_time).valueOf() - moment().valueOf() - offset;
        if (this.remainingTime < 0) {
          this.remainingTime = 0;
        }
        if (this.remainingTime === 0 && this.endAudio && !this.audioStarted) {
          this.audioStarted = true;
          this.showAttentionTimer = false;
          const audio = new Audio('../../../assets/audio/' + this.endAudio);
          audio.load();
          audio.play();
        }
        if (this.remainingTime < 10000 && this.attentionOverlay) {
          this.showAttentionTimer = true;
        }
      }
    } else {
      this.totalTime = 1;
      this.remainingTime = 0;
    }
  }

  progressBarWidth() {
    return (100 * (this.totalTime - this.remainingTime)) / this.totalTime;
  }

  get_min_sec() {
    const secondsRemaining = Math.floor(this.remainingTime / 1000);
    const min = Math.floor(secondsRemaining / 60);
    const sec = secondsRemaining - 60 * min;

    if (min < 0) {
      return { min: 0, sec: 0 };
    } else {
      return { min: min, sec: sec };
    }
  }
}

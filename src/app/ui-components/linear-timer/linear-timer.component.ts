import { DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Hammer } from 'hammerjs';
import * as moment from 'moment';
import { Timer } from '../../services/backend/schema';

@Component({
  selector: 'benji-linear-timer',
  templateUrl: './linear-timer.component.html',
  styleUrls: ['./linear-timer.component.scss']
})
export class LinearTimerComponent implements OnInit, OnDestroy {
  constructor(@Inject(DOCUMENT) document) {
    // function Timerr(duration, element) {
    //   const self = this;
    //   this.duration = duration;
    //   this.element = element;
    //   this.running = false;
    //   this.els = {
    //     ticker: document.getElementById('ticker'),
    //     seconds: document.getElementById('seconds')
    //   };
    //   console.log(document.getElementById('seconds'));
    //   // const hammerHandler = new Hammer(this.element);
    //   // hammerHandler.on('tap', function() {
    //   //   if (self.running) {
    //   //     self.reset();
    //   //   } else {
    //   //     self.start();
    //   //   }
    //   // });
    // }
    // Timerr.prototype.start = function() {
    //   const self = this;
    //   let start = null;
    //   this.running = true;
    //   let remainingSeconds = (this.els.seconds.textContent =
    //     this.duration / 1000);
    //   function draw(now) {
    //     if (!start) {
    //       start = now;
    //     }
    //     const diff = now - start;
    //     const newSeconds = Math.ceil((self.duration - diff) / 1000);
    //     if (diff <= self.duration) {
    //       self.els.ticker.style.height =
    //         100 - (diff / self.duration) * 100 + '%';
    //       if (newSeconds !== remainingSeconds) {
    //         self.els.seconds.textContent = newSeconds;
    //         remainingSeconds = newSeconds;
    //       }
    //       self.frameReq = window.requestAnimationFrame(draw);
    //     } else {
    //       // self.running = false;
    //       self.els.seconds.textContent = 0;
    //       self.els.ticker.style.height = '0%';
    //       self.element.classList.add('countdown--ended');
    //     }
    //   }
    //   self.frameReq = window.requestAnimationFrame(draw);
    // };
    // Timerr.prototype.reset = function() {
    //   this.running = false;
    //   window.cancelAnimationFrame(this.frameReq);
    //   this.els.seconds.textContent = this.duration / 1000;
    //   this.els.ticker.style.height = null;
    //   this.element.classList.remove('countdown--ended');
    // };
    // Timerr.prototype.setDuration = function(duration) {
    //   this.duration = duration;
    //   this.els.seconds.textContent = this.duration / 1000;
    // };
    // const timer = new Timerr(10000, document.getElementById('countdown'));
    // timer.start();
  }
  @Input() endAudio;
  @Input() timer: Timer;
  @Input() timerOffset: number;
  @Input() classes: string;

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

        this.remainingTime =
          moment(this.timer.end_time).valueOf() - moment().valueOf() - offset;
        if (this.remainingTime < 0) {
          this.remainingTime = 0;
          this.showAttentionTimer = false;
        }
        if (this.remainingTime === 0 && this.endAudio && !this.audioStarted) {
          this.audioStarted = true;
          const audio = new Audio('../../../assets/audio/' + this.endAudio);
          audio.load();
          audio.play();
        }
        if (this.remainingTime < 20000) {
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

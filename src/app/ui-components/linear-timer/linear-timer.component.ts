import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {Timer} from '../../services/backend/schema';

@Component({
  selector: 'app-linear-timer',
  templateUrl: './linear-timer.component.html',
  styleUrls: ['./linear-timer.component.scss']
})
export class LinearTimerComponent implements OnInit, OnDestroy {
  constructor() {}
  @Input() endAudio;
  @Input() timer: Timer;
  @Input() timerOffset: number;

  totalTime: number;
  remainingTime: number;

  timerInterval;
  audioStarted = false;

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
        this.remainingTime = Date.parse(this.timer.end_time) - Date.now() - offset;
        if (this.remainingTime < 0) {
          this.remainingTime = 0;
        }
        if (this.remainingTime === 0 && this.endAudio && !this.audioStarted) {
          this.audioStarted = true;
          const audio = new Audio('../../../assets/audio/' + this.endAudio);
          audio.load();
          audio.play();
        }
      }
    } else {
      this.totalTime = 1;
      this.remainingTime = 0;
    }
  }

  progressBarWidth() {
    return 100 * (this.totalTime - this.remainingTime) / this.totalTime;
  }
}

import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Timer } from '../../services/backend/schema/utils';

@Component({
  selector: 'app-radial-timer',
  templateUrl: './radial-timer.component.html',
})
export class RadialTimerComponent implements OnInit, OnDestroy {
  timerDiameter = 1;
  textWidth = 1;

  @Input() endStateText: string;
  @Input() endAudio;
  @Input() timer: Timer;
  @Input() timerOffset: number;
  @Input() attentionOverlay = false;

  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;

  totalTime: number;
  remainingTime: number;

  timerInterval;
  audioStarted = false;
  showAttentionTimer = false;

  constructor() {}

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    if (this.timer && this.timer.editor) {
      this.timerDiameter = window.innerWidth / 7.5;
      this.timerDiameter = Math.ceil(this.timerDiameter / 7) * 7;
      this.textWidth = this.timerDiameter / 25;
    } else {
      this.timerDiameter = window.innerWidth / 4.5;
      this.timerDiameter = Math.ceil(this.timerDiameter / 5) * 5;
      this.textWidth = this.timerDiameter / 25;
    }
  }

  ngOnInit() {
    this.getScreenSize();
    this.timerInterval = setInterval(() => this.update(), 100);
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
        // console.log(this.timer.end_time, this.timer.end_time.replace(/ /, 'T'));
        this.remainingTime = Date.parse(this.timer.end_time.replace(/ /, 'T')) - Date.now() - offset;
        if (this.remainingTime < 0) {
          this.remainingTime = 0;
        }
        if (this.remainingTime === 0 && this.endAudio && !this.audioStarted) {
          this.audioStarted = true;
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

  ngOnDestroy() {
    clearInterval(this.timerInterval);
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

  pctRemaining() {
    return (100 * this.remainingTime) / this.totalTime;
  }
}

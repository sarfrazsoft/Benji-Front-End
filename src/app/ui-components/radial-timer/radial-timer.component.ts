import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { init } from 'protractor/built/launcher';

@Component({
  selector: 'app-radial-timer',
  templateUrl: './radial-timer.component.html',
  styleUrls: []
  // encapsulation: ViewEncapsulation.None
})
export class RadialTimerComponent implements OnInit, OnDestroy {
  @Input() endStateText: string;
  @Input() endAudio: string;
  @Output() initCallback = new EventEmitter<RadialTimerComponent>();
  @Output() timeUpCallback = new EventEmitter<RadialTimerComponent>();

  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;

  totalTime: number;
  elapsedTime: number;
  public running = false;
  public timesUp = false;
  timerInterval;

  ngOnInit() {
    if (this.initCallback !== undefined) {
      this.initCallback.emit(this);
    }
  }

  ngOnDestroy() {
    if (this.endAudio) {
      const audio = new Audio();
      audio.src = '../../../assets/audio/' + this.endAudio;
      audio.load();
      audio.play();
    }
    if (this.running) {
      clearInterval(this.timerInterval);
    }
  }

  public startTimer(totalTime: number, startTime: number) {
    this.totalTime = totalTime;
    this.elapsedTime = startTime;
    this.running = true;
    this.timesUp = false;

    this.timerInterval = setInterval(() => {
      if (this.elapsedTime < this.totalTime) {
        this.elapsedTime += 100;
      } else {
        this.running = false;
        this.timesUp = true;
        this.elapsedTime = this.totalTime;
        clearInterval(this.timerInterval);

        if (this.timeUpCallback) {
          this.timeUpCallback.emit(this);
        }
      }
    }, 100);
  }

  public stopTimer() {
    clearInterval(this.timerInterval);
    this.running = false;
  }

  getTimer() {
    const secondsRemaining = Math.floor(
      (this.totalTime - this.elapsedTime) / 1000
    );
    const min = Math.floor(secondsRemaining / 60);
    const sec = secondsRemaining - 60 * min;

    if (min < 0) {
      return { min: 0, sec: 0 };
    } else {
      return { min: min, sec: sec };
    }
  }

  pctRemaining() {
    if (this.timesUp || (!this.timesUp && !this.running)) {
      return 100;
    } else {
      return (100 * (this.totalTime - this.elapsedTime)) / this.totalTime;
    }
  }
}

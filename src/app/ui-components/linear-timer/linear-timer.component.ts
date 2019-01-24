import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-linear-timer',
  templateUrl: './linear-timer.component.html',
  styleUrls: ['./linear-timer.component.scss']
})
export class LinearTimerComponent implements OnInit {
  constructor() {}
  @Output() callback = new EventEmitter();
  @Output() initCallback = new EventEmitter<LinearTimerComponent>();

  public timerInterval: any;
  public totalTime;
  public timeElapsed = 0;
  public progressBarWidth = '0';

  public running = false;

  ngOnInit() {
    if (this.initCallback !== undefined) {
      this.initCallback.emit(this);
    }
  }
  public startTimer(timerSeconds) {
    if (this.timerInterval !== undefined) {
      clearInterval(this.timerInterval);
    }
    this.running = true;
    this.totalTime = timerSeconds * 1000;
    this.timeElapsed = 0;

    this.timerInterval = setInterval(() => {
      this.timeElapsed = this.timeElapsed + 100;
      this.progressBarWidth = `${(this.timeElapsed / (this.totalTime - 1250)) *
        100}`;

      if (this.timeElapsed >= this.totalTime) {
        this.timeElapsed = this.totalTime;
        this.stopTimer(true);
      }
    }, 100);
  }

  public stopTimer(callback: boolean) {
    this.running = false;
    clearInterval(this.timerInterval);
    if (callback) {
      this.callback.emit();
    }
  }
}

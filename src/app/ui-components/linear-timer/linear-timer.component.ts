import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-linear-timer',
  templateUrl: './linear-timer.component.html',
  styleUrls: ['./linear-timer.component.scss']
})
export class LinearTimerComponent implements OnInit {

  constructor() { }
  @Output() callback = new EventEmitter();
  @Output() initCallback = new EventEmitter<LinearTimerComponent>();

  public _timeRemaining;
  public timerInterval: any;
  public initialTimeRemaining;
  public timeElapsed = 0;
  public progressBarWidth = '0';

  public running = false;

  ngOnInit() {
    if (this.initCallback !== undefined) {
      this.initCallback.emit(this);
    }
  }
  public startTimer(timerSeconds) {
    if (this.timerInterval !== undefined){
      clearInterval(this.timerInterval);
    }
    this.running = true;
    this.initialTimeRemaining = timerSeconds;
    this._timeRemaining = this.initialTimeRemaining;

    this.timerInterval = setInterval( () => {
      this._timeRemaining = this._timeRemaining - 1;
      this.timeElapsed = this.timeElapsed + 1;
      this.progressBarWidth = `${(this.timeElapsed / this.initialTimeRemaining) * 100}`;

      if  (this._timeRemaining === 0.0) {
        this.stopTimer(true);
      }

    }, 1000);
  }

  public stopTimer(callback: boolean) {
    this.running = false;
    clearInterval(this.timerInterval);
    if (callback) {
      this.callback.emit();
    }
  }
}

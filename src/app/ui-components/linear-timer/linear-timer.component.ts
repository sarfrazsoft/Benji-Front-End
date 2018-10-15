import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-linear-timer',
  templateUrl: './linear-timer.component.html',
  styleUrls: ['./linear-timer.component.scss']
})
export class LinearTimerComponent implements OnInit {

  constructor() { }

  @Input()
  set timeRemaining(secondsRemaining) {
    this._timeRemaining = parseInt(secondsRemaining, 10);
    this.initialTimeRemaining = parseInt(secondsRemaining, 10);
    this.startTimer();
  }

  @Input() timerType: string;

  @Output() timesUp = new EventEmitter<string>();

  public _timeRemaining;
  public timerInterval: any;
  public initialTimeRemaining;
  public timeElapsed = 0;
  public progressBarWidth = '0';

  ngOnInit() {
  }

  public startTimer() {
    this.timerInterval = setInterval( () => {
      this._timeRemaining = this._timeRemaining - 1;
      this.timeElapsed = this.timeElapsed + 1;
      const timeElapsedPercentage = `${(this.timeElapsed / this.initialTimeRemaining) * 100}`;

      this.progressBarWidth = timeElapsedPercentage;

      if  (this._timeRemaining === 0.0) {
        this.stopTimer();
      }

    }, 1000);
  }

  public stopTimer() {
    clearInterval(this.timerInterval);
    setTimeout(() => {
      this.timesUp.emit(this.timerType);
    }, 1000)
  }


}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { ContextService } from 'src/app/services';
import { BrainstormSubmissionCompleteInternalEvent, Timer } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-vote-control',
  templateUrl: './vote-control.component.html',
  styleUrls: [],
})
export class VoteControlComponent implements OnInit {
  votingSetup = true;
  votingStarted = false;

  timeInSeconds = 0;
  mins = 0;
  secs = 0;

  @Output() socketMessage = new EventEmitter<any>();

  constructor(private contextService: ContextService) {}

  minEntered($event) {
    this.calculateTime();
  }

  secEntered($event) {
    this.calculateTime();
  }

  calculateTime() {
    const mins = this.mins;
    const convertedSeconds = mins * 60;
    const seconds = this.secs;
    const totalSeconds = convertedSeconds + seconds;
    this.timeInSeconds = totalSeconds;
    // this.formControl.setValue(totalSeconds);
  }

  ngOnInit(): void {}

  startVoting() {
    // const timer2 = {
    //   end_time: '2021-04-05T12:42:09.443013-04:00',
    //   id: 57,
    //   remaining_seconds: 7654.294812,
    //   start_time: '2021-04-05T09:55:29.443013-04:00',
    //   status: 'running',
    //   total_seconds: 10000,
    // };

    this.socketMessage.emit(new BrainstormSubmissionCompleteInternalEvent());
    const startTime = moment().format();
    const endTime = moment(startTime).add(this.timeInSeconds, 'seconds').format();
    const timer: Timer = {
      end_time: endTime,
      id: 57,
      remaining_seconds: 100,
      start_time: startTime,
      status: 'running',
      total_seconds: this.timeInSeconds,
      editor: false,
    };

    this.contextService.activityTimer = timer;
  }
}

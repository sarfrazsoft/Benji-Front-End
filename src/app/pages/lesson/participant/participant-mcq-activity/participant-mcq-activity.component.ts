import {Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges} from '@angular/core';
import {BaseActivityComponent} from '../../shared/base-activity.component';

@Component({
  selector: 'app-participant-mcq-activity',
  templateUrl: './participant-mcq-activity.component.html',
  styleUrls: ['./participant-mcq-activity.component.scss']
})
export class ParticipantMcqActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {

  @ViewChild('questionTimer') questionTimer;
  questionSeconds;

  @ViewChild('revealTimer') revealTimer;
  revealSeconds;

  selectedAnswer;

  ngOnInit() {
    this.questionSeconds = (Date.parse(this.activityState.activity_status.countdown_time) - Date.now()) / 1000;
    this.questionTimer.startTimer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activityState'] &&
      (changes['activityState'].previousValue.activity_status.pause_time === null || changes['activityState'].previousValue.activity_status.pause_time === undefined) &&
      (changes['activityState'].currentValue.activity_status.pause_time !== null && changes['activityState'].currentValue.activity_status.pause_time !== undefined)) {
      this.revealSeconds = (Date.parse(this.activityState.activity_status.pause_time) - Date.now()) / 1000;
      this.revealTimer.startTimer();
    }
  }

  reveal() {
    return this.activityState.activity_status.pause_time !== null && this.activityState.activity_status.pause_time !== undefined;
  }

  correctChoice() {
    return this.activityState.activity_status.question.choices.find((choice) => choice.is_correct );
  }

  public submitAnswer(answer) {
    if (!this.reveal()) {
      this.selectedAnswer = answer;
      this.sendMessage.emit({event: 'submit_answer', answer: answer.id});
    }
  }
}

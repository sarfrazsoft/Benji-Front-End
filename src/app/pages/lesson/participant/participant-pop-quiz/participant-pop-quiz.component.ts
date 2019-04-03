import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MCQSubmitAnswerEvent } from 'src/app/services/backend/schema/messages';
import { MCQChoice } from 'src/app/services/backend/schema/utils';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-participant-pop-quiz',
  templateUrl: './participant-pop-quiz.component.html',
  styleUrls: ['./participant-pop-quiz.component.scss']
})
export class ParticipantPopQuizComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  selectedChoice: MCQChoice = {
    id: null,
    is_correct: null,
    choice_text: null,
    explanation: null
  };
  revealAnswer = false;
  @ViewChild('timer') timer;

  constructor() {
    super();
  }

  optionIdentifiers = ['A', 'B', 'C', 'D'];

  ngOnInit() {}

  ngOnChanges() {
    const as = this.activityState;
    if (
      as.mcqactivity.question_timer &&
      as.mcqactivity.question_timer.status === 'running'
    ) {
      this.revealAnswer = false;
      this.selectedChoice = {
        id: null,
        is_correct: null,
        choice_text: null,
        explanation: null
      };
      this.initTimer(as.mcqactivity.question_timer.end_time);
    } else if (
      as.base_activity.next_activity_start_timer &&
      as.base_activity.next_activity_start_timer.status === 'running'
    ) {
      this.revealAnswer = true;
      this.initTimer(as.base_activity.next_activity_start_timer.end_time);
    }
  }

  submitAnswer(option: MCQChoice) {
    if (!this.revealAnswer) {
      this.selectedChoice = option;
      // this.sendMessage.emit(new MCQSubmitAnswerEvent(option));
    }
  }

  initTimer(endTime: string) {
    this.timer.startTimer(0);
    const seconds = (Date.parse(endTime) - Date.now()) / 1000;
    this.timer.startTimer(seconds);
  }
}

import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import {
  MCQChoice,
  MCQSubmitAnswerEvent
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-pop-quiz',
  templateUrl: './pop-quiz.component.html',
  styleUrls: ['./pop-quiz.component.scss']
})
export class ParticipantPopQuizComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  questionTimerStarted = false;
  showResults = false;
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

  optionIdentifiers = ['A', 'B', 'C', 'D', 'E', 'F'];

  ngOnInit() {
    this.activityState.mcqactivity.question.mcqchoice_set.sort(
      (a, b) => a.id - b.id
    );
  }

  ngOnChanges() {
    const as = this.activityState;
    this.activityState.mcqactivity.question.mcqchoice_set.sort(
      (a, b) => a.id - b.id
    );
    if (
      as.mcqactivity.question_timer &&
      (as.mcqactivity.question_timer.status === 'running' ||
        as.mcqactivity.question_timer.status === 'paused')
    ) {
      if (!this.questionTimerStarted) {
        this.selectedChoice = {
          id: null,
          is_correct: null,
          choice_text: null,
          explanation: null
        };
        this.questionTimerStarted = true;
      }
    } else if (
      as.base_activity.next_activity_start_timer &&
      (as.base_activity.next_activity_start_timer.status === 'running' ||
        as.base_activity.next_activity_start_timer.status === 'paused')
    ) {
      this.questionTimerStarted = false;
    } else if (as.mcqresultsactivity) {
      this.showResults = true;
    }
  }

  submitAnswer(option: MCQChoice) {
    this.selectedChoice = option;
    this.sendMessage.emit(new MCQSubmitAnswerEvent(option));
  }

  getCorrectAnswer() {
    return this.activityState.mcqactivity.question.mcqchoice_set.find(
      q => q.is_correct
    );
  }
}

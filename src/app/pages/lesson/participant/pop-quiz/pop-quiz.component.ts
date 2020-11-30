import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ContextService } from 'src/app/services';
import { MCQChoice, MCQSubmitAnswerEvent, Timer } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-pop-quiz',
  templateUrl: './pop-quiz.component.html',
  styleUrls: ['./pop-quiz.component.scss'],
})
export class ParticipantPopQuizComponent extends BaseActivityComponent implements OnInit, OnChanges {
  questionTimerStarted = false;
  showResults = false;
  showQuestion = false;
  showQuestionsAnswer = false;
  answerSubmitted = false;

  @Input() editor = false;

  selectedChoice: MCQChoice = {
    id: null,
    is_correct: null,
    choice_text: null,
    explanation: null,
    order: null,
  };
  revealAnswer = false;
  @ViewChild('timer', { static: false }) timer;

  localStorageItemName = 'mcqSelectedChoice';

  constructor(private contextService: ContextService) {
    super();
  }

  optionIdentifiers = ['A', 'B', 'C', 'D', 'E', 'F'];

  ngOnInit() {
    super.ngOnInit();
    const as = this.activityState;
    if (as.mcqactivity.question.mcqchoice_set[0] && as.mcqactivity.question.mcqchoice_set[0].id) {
      as.mcqactivity.question.mcqchoice_set.sort((a, b) => a.id - b.id);
    }
    this.contextService.activityTimer = { status: 'cancelled' } as Timer;

    if (localStorage.getItem(this.localStorageItemName)) {
      this.selectedChoice = JSON.parse(localStorage.getItem(this.localStorageItemName));
    }
    this.changes();
  }

  changes() {
    const as = this.activityState;
    if (as.mcqactivity.question.mcqchoice_set[0] && as.mcqactivity.question.mcqchoice_set[0].id) {
      this.activityState.mcqactivity.question.mcqchoice_set.sort((a, b) => a.id - b.id);
    }
    if (this.editor) {
      this.showQuestion = true;
    }
    if (
      as.mcqactivity.question_timer &&
      (as.mcqactivity.question_timer.status === 'running' ||
        as.mcqactivity.question_timer.status === 'paused')
    ) {
      this.showQuestion = true;
      this.showQuestionsAnswer = false;
      if (!this.questionTimerStarted) {
        localStorage.removeItem(this.localStorageItemName);
        this.selectedChoice = {
          id: null,
          is_correct: null,
          choice_text: null,
          explanation: null,
          order: null,
        };
        this.questionTimerStarted = true;
      }
    } else if (
      this.getNextActStartTimer() &&
      (this.getNextActStartTimer().status === 'running' || this.getNextActStartTimer().status === 'paused')
    ) {
      this.questionTimerStarted = false;
      this.showQuestion = false;
      this.showQuestionsAnswer = true;
      this.answerSubmitted = false;
    } else if (as.mcqresultsactivity) {
      this.showResults = true;
    }
  }

  ngOnChanges() {
    this.changes();
  }

  selectOption(option: MCQChoice) {
    if (!this.answerSubmitted) {
      this.selectedChoice = option;
      localStorage.setItem(this.localStorageItemName, JSON.stringify(option));
    }
  }

  submitAnswer() {
    if (this.selectedChoice.id) {
      this.sendMessage.emit(new MCQSubmitAnswerEvent(this.selectedChoice));
      this.answerSubmitted = true;
    }
  }

  getCorrectAnswer() {
    return this.activityState.mcqactivity.question.mcqchoice_set.find((q) => q.is_correct);
  }
}

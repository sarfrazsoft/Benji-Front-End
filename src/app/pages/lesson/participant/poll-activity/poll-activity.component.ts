import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ContextService } from 'src/app/services';
import { MCQChoice, PollSubmitAnswerEvent, Timer, UpdateMessage } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-poll',
  templateUrl: './poll-activity.component.html',
})
export class ParticipantPollComponent extends BaseActivityComponent implements OnInit, OnChanges {
  act: UpdateMessage['pollactivity'];
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
  @ViewChild('timer') timer;

  localStorageItemName = 'mcqSelectedChoice';

  constructor(private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.act = this.activityState.pollactivity;
    if (this.act.question.mcqchoice_set[0] && this.act.question.mcqchoice_set[0].id) {
      this.act.question.mcqchoice_set.sort((a, b) => a.id - b.id);
    }
    this.contextService.activityTimer = { status: 'cancelled' } as Timer;

    if (localStorage.getItem(this.localStorageItemName)) {
      this.selectedChoice = JSON.parse(localStorage.getItem(this.localStorageItemName));
    }
    this.changes();
  }

  changes() {
    const as = this.activityState;
    if (this.act.question.mcqchoice_set[0] && this.act.question.mcqchoice_set[0].id) {
      this.act.question.mcqchoice_set.sort((a, b) => a.id - b.id);
    }
    if (this.editor) {
      this.showQuestion = true;
    }
    if (
      this.act.question_timer &&
      (this.act.question_timer.status === 'running' || this.act.question_timer.status === 'paused')
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
    this.act = this.activityState.pollactivity;
    this.changes();
  }

  selectOption(option: MCQChoice) {
    if (!this.answerSubmitted && option.id) {
      this.selectedChoice = option;
      localStorage.setItem(this.localStorageItemName, JSON.stringify(option));
    }
  }

  submitAnswer() {
    if (this.selectedChoice.id) {
      this.sendMessage.emit(new PollSubmitAnswerEvent(this.selectedChoice));
      this.answerSubmitted = true;
    }
  }

  getCorrectAnswer() {
    return this.act.question.mcqchoice_set.find((q) => q.is_correct);
  }
}

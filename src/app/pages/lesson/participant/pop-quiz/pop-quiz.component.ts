import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { filter, find, findIndex, remove } from 'lodash';
import { ContextService } from 'src/app/services';
import { MCQChoice, MCQSubmitAnswerEvent, Timer } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-pop-quiz',
  templateUrl: './pop-quiz.component.html',
})
export class ParticipantPopQuizComponent extends BaseActivityComponent implements OnInit, OnChanges {
  questionTimerStarted = false;
  showResults = false;
  showQuestion = false;
  showQuestionsAnswer = false;
  answerSubmitted = false;

  @Input() editor = false;

  selectedChoices: Array<MCQChoice> = [];
  //  {
  //   id: null,
  //   is_correct: null,
  //   choice_text: null,
  //   explanation: null,
  //   order: null,
  // };
  revealAnswer = false;
  // @ViewChild('timer') timer;
  timer: Timer;

  localStorageItemName;

  constructor(private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    const as = this.activityState;
    this.localStorageItemName = 'mcqSelectedChoice' + as.mcqactivity.activity_id;

    if (as.mcqactivity.question.mcqchoice_set[0] && as.mcqactivity.question.mcqchoice_set[0].id) {
      as.mcqactivity.question.mcqchoice_set.sort((a, b) => a.id - b.id);
    }
    this.contextService.activityTimer = { status: 'cancelled' } as Timer;

    this.selectedChoices = [];
    if (localStorage.getItem(this.localStorageItemName)) {
      this.selectedChoices = JSON.parse(localStorage.getItem(this.localStorageItemName));
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
      this.timer = as.mcqactivity.question_timer;
      if (!this.questionTimerStarted) {
        localStorage.removeItem(this.localStorageItemName);
        this.selectedChoices = [];
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
    if (!this.answerSubmitted && option.id) {
      const multiSelect = this.activityState.mcqactivity.multiple_correct_answer;
      if (multiSelect) {
        const alreadyPresent = find(this.selectedChoices, (choice) => choice.id === option.id);
        if (alreadyPresent) {
          remove(this.selectedChoices, (choice) => choice.id === option.id);
        } else {
          this.selectedChoices.push(option);
        }
      } else {
        if (this.selectedChoices.length) {
          this.selectedChoices[0] = option;
        } else {
          this.selectedChoices.push(option);
        }
      }
      localStorage.setItem(this.localStorageItemName, JSON.stringify(this.selectedChoices));
    }
  }

  submitAnswer() {
    if (this.selectedChoices.length) {
      this.sendMessage.emit(new MCQSubmitAnswerEvent(this.selectedChoices));
      this.answerSubmitted = true;
    }
  }

  getCorrectAnswer() {
    return this.activityState.mcqactivity.question.mcqchoice_set.find((q) => q.is_correct);
  }

  isSelected(option: MCQChoice) {
    const alreadyPresent = find(this.selectedChoices, (choice) => choice.id === option.id);
    if (alreadyPresent) {
      return true;
    } else {
      return false;
    }
  }

  getCorrectChoices() {
    const arr = filter(this.activityState.mcqactivity.question.mcqchoice_set, (choice) => choice.is_correct);
    return arr;
  }

  gotCorrectAnswers() {
    const incorrectChoicePresent = find(this.selectedChoices, (choice) => !choice.is_correct);
    if (incorrectChoicePresent) {
      return 'allCorrect';
    } else {
      const correctChoices = this.getCorrectChoices();
      // iterate over selected choices
      // push into an array when he gets one correct answer
      // if the new array is same length as correctChoices return allCorrect
      // if it is less than the correctChoices return someCorrect
      // if new array is empty return allWrong

      const correctChoicesGotten = [];
      this.selectedChoices.forEach((val: MCQChoice) => {
        const index = findIndex(correctChoices, (o) => {
          return o.id === val.id;
        });
        if (index > -1) {
          correctChoicesGotten.push(val);
        }
      });
      if (correctChoicesGotten.length === 0) {
        return 'allWrong';
      } else if (correctChoicesGotten.length === correctChoices.length) {
        return 'allCorrect';
      } else if (correctChoicesGotten.length < correctChoices.length) {
        return 'someCorrect';
      }
    }
  }
}

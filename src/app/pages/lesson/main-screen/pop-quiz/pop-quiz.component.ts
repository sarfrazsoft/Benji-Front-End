import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { filter, find, findIndex, remove } from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, Subscription } from 'rxjs';
import { ContextService } from 'src/app/services';
import { LeaderBoard, MCQActivity, MCQChoiceSet, ParticipantRanks } from 'src/app/services/backend/schema';
import { MCQChoice, MCQSubmitAnswerEvent, Timer } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-pop-quiz',
  templateUrl: './pop-quiz.component.html',
})
export class MainScreenPopQuizComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges, OnDestroy {
  questionTimerStarted = false;
  showResults = false;
  showQuestion = false;
  showQuestionsAnswer = false;
  answerSubmitted = false;
  answeredChoices = [];

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
  isAdmin;

  constructor(private contextService: ContextService, private permissionsService: NgxPermissionsService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    const as = this.activityState;
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      this.isAdmin = val;
    });
    this.localStorageItemName = 'mcqSelectedChoice' + as.mcqactivity.activity_id;

    if (as.mcqactivity.question.mcqchoice_set[0] && as.mcqactivity.question.mcqchoice_set[0].id) {
      as.mcqactivity.question.mcqchoice_set.sort((a, b) => a.id - b.id);
    }
    this.contextService.activityTimer = { status: 'cancelled' } as Timer;

    this.selectedChoices = [];
    // if (localStorage.getItem(this.localStorageItemName)) {
    //   this.selectedChoices = JSON.parse(localStorage.getItem(this.localStorageItemName));
    // }
    this.changes();
  }

  ngOnDestroy() {}

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
      this.populateResponsePercents(as.mcqactivity);
      this.showQuestionsAnswer = true;
      this.answerSubmitted = false;
    } else if (as.mcqresultsactivity) {
      this.showResults = true;
    }
  }

  populateResponsePercents(act: MCQActivity) {
    const choice_answers = [
      { choice_id: 3, selections: 4 },
      { choice_id: 1, selections: 2 },
    ];
    console.log(act);
    this.answeredChoices = [];
    let totalSelections = 0;
    act.question.mcqchoice_set.forEach((choice) => {
      const selections = choice_answers.filter((v) => v.choice_id === choice.id)[0].selections;
      totalSelections = selections + totalSelections;
      this.answeredChoices.push({ ...choice, noOfResponses: selections });
    });
  }

  ngOnChanges() {
    this.changes();
  }

  selectOption(option: MCQChoice) {
    if (this.isAdmin) {
      return;
    }
    if (!this.answerSubmitted && option.id) {
      const multiSelect = this.activityState.mcqactivity.multiple_correct_answer;
      if (multiSelect) {
        const alreadyPresent = find(this.selectedChoices, (choice) => choice.id === option.id);
        if (alreadyPresent) {
          remove(this.selectedChoices, (choice) => choice.id === option.id);
        } else {
          this.selectedChoices.push(option);
          // this.sendMessage.emit(new MCQSubmitAnswerEvent(this.selectedChoices));
        }
      } else {
        if (this.selectedChoices.length) {
          this.selectedChoices[0] = option;
        } else {
          this.selectedChoices.push(option);
        }
        // this.sendMessage.emit(new MCQSubmitAnswerEvent(this.selectedChoices));
      }
      // localStorage.setItem(this.localStorageItemName, JSON.stringify(this.selectedChoices));
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

  answersResults(): 'allWrong' | 'allCorrect' | 'someCorrect' {
    const incorrectChoicePresent = find(this.selectedChoices, (choice) => !choice.is_correct);
    // console.log(incorrectChoicePresent);
    // if (incorrectChoicePresent) {
    //   return 'allCorrect';
    // } else {
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
    // }
  }

  getResultText() {
    const result = this.answersResults();
    if (result === 'allCorrect') {
      return 'You got it!';
    } else if (result === 'allWrong') {
      return 'Oops, incorrect!';
    } else if (result === 'someCorrect') {
      return 'Nearly got it!';
    }
  }
}

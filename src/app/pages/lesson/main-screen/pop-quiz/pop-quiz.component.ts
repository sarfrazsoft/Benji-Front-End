import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { filter, find, findIndex, noop, remove } from 'lodash';
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
  totalSelections = 0;
  unansweredParticipants = [];
  answeredParticipants = [];
  revealAnswer = false;
  timer: Timer;
  localStorageItemName;
  isAdmin;
  joinedUsers: any[];
  participantRanks = [];

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
    
    this.loadParticipantsCounts();
    this.loadParticipantRanks();
  }

  populateResponsePercents(act: MCQActivity) {
    const choice_answers = act.choice_answers;
    this.answeredChoices = [];
    this.totalSelections = 0;
    choice_answers.forEach((answer) => {
      this.totalSelections = this.totalSelections + answer.selections;
    });
    act.question.mcqchoice_set.forEach((choice) => {
      const selections = choice_answers.filter((v) => v.choice_id === choice.id);
      let noOfSelections = 0;
      if (selections.length) {
        noOfSelections = selections[0].selections;
      }

      const responsePercent = this.totalSelections
        ? Math.round((noOfSelections / this.totalSelections) * 100)
        : 0;

      this.answeredChoices.push({
        ...choice,
        text: choice.choice_text,
        noOfResponses: noOfSelections,
        responsePercent: responsePercent,
      });
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
        }
      } else {
        if (this.selectedChoices.length) {
          this.selectedChoices[0] = option;
        } else {
          this.selectedChoices.push(option);
        }
      }
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

  
  loadParticipantsCounts() {
    this.joinedUsers = [];
    this.answeredParticipants = [];
    this.unansweredParticipants = [];
    this.joinedUsers = this.getActiveParticipants();
    this.activityState.mcqactivity.answered_participants.forEach((participant) => {
      let participantName = this.getParticipantName(participant.participant_code);
      if(!this.answeredParticipants.includes(participantName)) {
        this.answeredParticipants.push(participantName);
      }
    });
    this.unansweredParticipants = this.getUnAnsweredUsers();
  }

  getUnAnsweredUsers() {
    const answered = this.answeredParticipants;
    const active = [];
    for (let index = 0; index < this.joinedUsers.length; index++) {
      active.push(this.joinedUsers[index].display_name);
    }
    return active.filter((name) => !answered.includes(name));
  }

  loadParticipantRanks() {

    this.participantRanks = [];
    let obj = this.activityState.mcqactivity.participant_ranks;
    console.log (this.activityState.mcqactivity.participant_ranks);
    let entries = Object.entries (obj);
    let sorted = entries.sort((a: any, b: any) => b[1] - a[1]);
    
    sorted.forEach((value) => {
      this.participantRanks.push(
        {'name': this.getParticipantName(parseInt(value[0])), 
          'score': parseInt(value[1].toString()) });
    });
  }
}

import {Component, OnInit, ViewEncapsulation, OnDestroy, OnChanges, SimpleChanges, Input} from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import {BackendService} from '../../../services/backend.service';

@Component({
  selector: 'app-mobile-activity-mcq',
  template:
  '<div class="mobile-content-wrap-wide" *ngIf="!answer">\n' +
  '      <h1 class="question-header">{{ activityDetails.mcqactivity.question }}</h1>' +
  '      <a *ngFor="let q of activityDetails.mcqactivity.mcqanswers_set" (click)="submitAnswer(q)" [ngClass]="getClass(q)">' +
  '        <strong>{{ numToLetter(q.order) }}.</strong>  {{ q.answer }}' +
  '      </a>' +
  '</div>' +
  '<div class="mobile-content-wrap-wide" *ngIf="answer || noAnswer">' +
  '  <img src="assets/img/party-popper_1f389.png" height="100" *ngIf="isCorrect">\n' +
  '  <img src="assets/img/george.png" height="100" *ngIf="!isCorrect || noAnswer">\n' +
  '      <h1 class="heading-2" *ngIf="isCorrect && !noAnswer">Correct!<br></h1>\n' +
  '      <h1 class="heading-2" *ngIf="!isCorrect && !noAnswer">Oops, incorrect<br></h1>\n' +
  '      <h1 class="heading-2" *ngIf="noAnswer">Oops, times up!<br></h1>\n' +
  '      <div class="mobile-text" *ngIf="!noAnswer">{{ answer.explanation  }}<br></div>' +
  '      <div class="mobile-text" *ngIf="noAnswer">The correct answer was<br></div>' +
  '      <a class="correct-button w-button" *ngIf="isCorrect"><strong>{{ numToLetter(answer.order) }}.</strong>  {{answer.answer}}</a>\n' +
  '      <a class="incorrect-button w-button" *ngIf="!isCorrect"><strong>{{ numToLetter(answer.order) }}.</strong> {{answer.answer}}</a>\n' +
  '\t</div>',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileMCQActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy, OnChanges {
  @Input() joinedUsers;
  answer;
  selected;
  isCorrect;
  noAnswer;

  constructor(private backend: BackendService) { super(); }

  ngOnInit() {
    setTimeout(() => this.showAnswerMode(), (this.activityDetails.mcqactivity.timer) * 1000);
  }

  ngOnDestroy() {
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    const completed = this.activityRun.activityrunuser_set.filter(
      x => x.activityrunuserparams_set.find(y => y.param_name === 'answer') !== undefined).length;
    const total = this.activityRun.activityrunuser_set.length;

    if (completed >= this.joinedUsers.length && !this.answer) {
      this.showAnswerMode();
    }
  }

  showAnswerMode() {
    if (!this.selected) {
      this.noAnswer = true;
      this.answer = this.activityDetails.mcqactivity.mcqanswers_set.find(x => x.is_correct);
    } else {
      this.answer = this.selected;
    }
  }

  numToLetter(num) {
    return 'ABCDEFGHIJK'.charAt(num - 1);
  }

  submitAnswer(ans) {
    if (!this.selected) {
      this.selected = ans;
      this.isCorrect = ans.is_correct;
      this.backend.set_activity_user_parameter(this.activityRun.id, 'answer', ans.id).subscribe();
    }
  }

  getClass(q) {
    if (this.selected && this.selected.id === q.id) {
      return 'w-button selected-button';
    } else {
      return 'w-button question-button';
    }
  }


}

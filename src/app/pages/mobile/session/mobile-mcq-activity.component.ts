import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import {BackendService} from '../../../services/backend.service';

@Component({
  selector: 'app-mobile-activity-mcq',
  template:
  '<div class="mobile-content-wrap-wide" *ngIf="!answer">\n' +
  '      <h1 class="question-header">{{ activityDetails.mcqactivity.question }}</h1>' +
  '      <a class="question-button w-button" *ngFor="let q of activityDetails.mcqactivity.mcqanswers_set" (click)="submitAnswer(q)">' +
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

export class MobileMCQActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy {
  answer;
  isCorrect;
  noAnswer;

  constructor(private backend: BackendService) { super(); }

  ngOnInit() {
    setTimeout(() => this.showAnswerMode(), (this.activityDetails.mcqactivity.timer) * 1000);
  }

  ngOnDestroy() {
  }

  showAnswerMode() {
    if (!this.answer) {
      this.noAnswer = true;
      this.answer = this.activityDetails.mcqactivity.mcqanswers_set.find(x => x.is_correct);
    }
  }

  numToLetter(num) {
    return 'ABCDEFGHIJK'.charAt(num - 1);
  }

  submitAnswer(ans) {
    this.answer = ans;
    this.isCorrect = ans.is_correct;

    this.backend.set_activity_user_parameter(this.activityRun.id, 'answer', ans.id).subscribe();
  }


}

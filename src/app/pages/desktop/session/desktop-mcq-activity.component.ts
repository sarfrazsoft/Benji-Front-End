import {Component, OnInit, ViewEncapsulation, OnDestroy, Output, EventEmitter, SimpleChanges, OnChanges, Input} from '@angular/core';

import {interval} from 'rxjs/internal/observable/interval';

import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'app-desktop-activity-mcq',
  template:
  '<div class="body-div">\n' +
  '    <div class="two-column-body">\n' +
  '      <div class="body-content-no-border">\n' +
  '        <div class="left-body-wrap-w-boarder">\n' +
  '          <h1 class="mcq-header">{{ activityDetails.mcqactivity.question }}<br></h1>\n' +
  '          <div *ngIf="!showAnswer"><div class="answer-text" *ngFor="let q of activityDetails.mcqactivity.mcqanswers_set">' +
  '            <strong>{{ numToLetter(q.order) }}.</strong> {{ q.answer }}' +
  '          </div></div>\n' +
  '          <div class="answer-text correct" *ngIf="showAnswer"><strong>{{ numToLetter(correctAnswer.order) }}.</strong> {{ correctAnswer.answer }}</div>\n' +
  '          <div class="explanation" *ngIf="showAnswer"><strong>{{ correctAnswer.explanation }}</strong></div>' +
  '        </div>\n' +
  '        <div class="mcq-right-side"><app-radial-timer [secondsElapsed]="countdown / 10" [totalSeconds]="activityDetails.mcqactivity.timer"></app-radial-timer></div>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '  </div>',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class DesktopMCQActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy, OnChanges {
  @Input() footer;
  @Input() joinedUsers;
  @Output() timerUp = new EventEmitter<boolean>();

  countdown = 0;
  countdownInterval;
  correctAnswer;
  showAnswer = false;

  ngOnInit() {
    this.countdownInterval = interval(100).subscribe(() => ++this.countdown);
    this.footer.showProgress = true;
    this.footer.completed = 0;
    this.footer.total = this.activityRun.activityrunuser_set.length;
    this.footer.statusText = ' people have submitted';

    this.correctAnswer = this.activityDetails.mcqactivity.mcqanswers_set.find(x => x.is_correct);
    setTimeout(() => this.showAnswerMode(), (this.activityDetails.mcqactivity.timer) * 1000);
  }

  showAnswerMode() {
    if (!this.showAnswer) {
      this.showAnswer = true;
      this.countdownInterval.unsubscribe();
      setTimeout(() => { this.timerUp.emit(true); }, 7000);
    }
  }

  ngOnDestroy() {
    this.countdownInterval.unsubscribe();
    this.footer.showProgress = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    this.footer.completed = this.activityRun.activityrunuser_set.filter(
      x => x.activityrunuserparams_set.find(y => y.param_name === 'answer') !== undefined).length;
    this.footer.total = this.activityRun.activityrunuser_set.length;

    if (this.footer.completed >= this.joinedUsers.length && !this.showAnswer) {
      this.showAnswerMode();
    }
  }

  numToLetter(num) {
    return 'ABCDEFGHIJK'.charAt(num - 1);
  }

}

import {Component, OnInit, ViewEncapsulation, Input, Output, OnDestroy, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {interval} from 'rxjs/internal/observable/interval';

import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'app-desktop-activity-feedback',
  template: '<div class="centred-aligned-screen-body-wpb" *ngIf="!showThankYou">\n' +
  '    <div class="medium-width-content-slide-wrap"><img src="assets/img/pencil_270f.png" height="115">\n' +
  '      <h1 class="content-header">Final thoughts</h1>\n' +
  '      <div class="grey-text">Thank you for participating in {{ sessionDetails.session.session_name }}! <br>Now, please fill out the short form on your phone to let us know your thoughts on the session. <br>(It’s quick, we promise)<br></div>\n' +
  '    </div>\n' +
  '    <div class="timer-bar">\n' +
  '      <mat-progress-bar mode="determinate" [value]="countdown * 10 / activityDetails.feedbackactivity.timer"></mat-progress-bar>' +
  '    </div>\n' +
  '  </div>' +
  '<div class="centred-aligned-screen-body" *ngIf="showThankYou">\n' +
  '    <div class="content-slide-wrap">\n' +
  '      <h1 class="content-header">Thank you!</h1>\n' +
  '      <div class="grey-text">Thanks for your feedback and for joining this session!<br></div><img src="assets/img/Thanks.gif" height="300" class="giphy"></div>\n' +
  '  </div>',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class DesktopFeedbackActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy, OnChanges {
  @Output() timerUp = new EventEmitter<boolean>();
  @Input() joinedUsers;

  countdown = 0;
  progressBarInterval;

  showThankYou = false;

  constructor(public matProgressBar: MatProgressBarModule) { super(); }

  ngOnInit() {
    // setTimeout(() => this.timerUp.emit(true), (this.activityDetails.feedbackactivity.timer) * 1000);
    this.progressBarInterval = interval(100).subscribe(val => ++this.countdown);
  }

  ngOnDestroy() {
    if (this.progressBarInterval) {
      this.progressBarInterval.unsubscribe();
    }
  }

  thankYouMode() {
    this.showThankYou = true;
    if (this.progressBarInterval) {
      this.progressBarInterval.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    const completedUsers = this.activityRun.activityrunuser_set.filter(
      x => x.activityrunuserparams_set.length >= this.activityDetails.feedbackactivity.feedbackprompt_set.length);

    if (completedUsers && completedUsers.length >= this.joinedUsers.length) {
      this.thankYouMode();
    }

  }
}

import {Component, OnInit, ViewEncapsulation, Input, Output, OnDestroy, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {interval} from 'rxjs/internal/observable/interval';

import { BaseActivityComponent } from '../../../../shared/base-activity.component';

@Component({
  selector: 'app-mainscreen-activity-feedback',
  templateUrl: './main-screen-feedback-activity.component.html',
  styleUrls: []
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

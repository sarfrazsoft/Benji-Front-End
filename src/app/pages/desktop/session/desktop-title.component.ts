import {Component, OnInit, ViewEncapsulation, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {interval} from 'rxjs/internal/observable/interval';

import { DesktopBaseActivityComponent } from './desktop-base-activity.component';

@Component({
  selector: 'app-desktop-activity-title',
  template: '<div class="centred-aligned-screen-body-div">\n' +
  '    <div class="wide-content-slide-wrap">\n' +
  '      <h1 class="content-header">{{ sessionDetails.session.session_name }}</h1>\n' +
  '      <div class="grey-text">This session will take about {{ sessionDetails.session.session_length }} minutes.<br>Here’s what we’ll do.<br></div>\n' +
  '      <div class="bordered-text-wrap-div">\n' +
  '        <div class="left-alligned-grey-text" [innerHTML]="sessionDetails.session.session_description"></div>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '    <div class="timer-bar">\n' +
  '      <mat-progress-bar mode="determinate" [value]="countdown * 10 / activityDetails.titleactivity.timer"></mat-progress-bar>' +
  '    </div>\n' +
  '  </div>',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class DesktopTitleComponent extends DesktopBaseActivityComponent implements OnInit, OnDestroy {
  @Output() timerUp = new EventEmitter<boolean>();

  countdown = 0;
  progressBarInterval;

  constructor(public matProgressBar: MatProgressBarModule) { super(); }

  ngOnInit() {
    setTimeout(() => this.timerUp.emit(true), (this.activityDetails.titleactivity.timer) * 1000);
    this.progressBarInterval = interval(100).subscribe(val => ++this.countdown);
  }

  ngOnDestroy() {
    this.progressBarInterval.unsubscribe();
  }
}

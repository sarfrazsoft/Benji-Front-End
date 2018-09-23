import {Component, OnInit, ViewEncapsulation, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {interval} from 'rxjs/internal/observable/interval';

import { BaseActivityComponent } from '../../../shared/base-activity.component';

@Component({
  selector: 'app-mainscreen-activity-title',
  templateUrl: './main-screen-title.component.html' ,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MainScreenTitleComponent extends BaseActivityComponent implements OnInit, OnDestroy {
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

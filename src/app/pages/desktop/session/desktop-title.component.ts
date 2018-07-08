import {Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {interval} from 'rxjs/internal/observable/interval';


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
  '      <mat-progress-bar mode="determinate" [value]="countdown * 10 / activityDetails.current_activity.titleactivity.timer"></mat-progress-bar>' +
  '    </div>\n' +
  '  </div>',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class DesktopTitleComponent implements OnInit, OnDestroy {
  public activityDetails;
  public sessionDetails;
  countdown = 0;

  progressBarInterval;

  constructor(public matProgressBar: MatProgressBarModule, private backend: BackendService) {
    this.activityDetails = {'activity': {'titleactivity': {'timer': 30}}};
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.progressBarInterval.unsubscribe();
  }

  dataInit() {
    setTimeout(() => this.backend.start_next_activity(this.sessionDetails.session.id).subscribe(),
      (this.activityDetails.current_activity.titleactivity.timer) * 1000);
    this.progressBarInterval = interval(100).subscribe(val => ++this.countdown);
  }
}

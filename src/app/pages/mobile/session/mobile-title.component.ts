import {Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {interval} from 'rxjs/internal/observable/interval';


@Component({
  selector: 'app-desktop-activity-title',
  template: '<div class="mobile-content-wrap-wide">\n' +
  '    <h1 class="heading-2">{{ sessionDetails.session.session_name }}</h1>\n' +
  '      <div class="mobile-text">Get ready to begin! </div><a (click)="indicateReady()" class="dark-blue-button w-button">Ready</a>\n' +
  '     </div>\n',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileTitleComponent implements OnInit, OnDestroy {
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
  }

  dataInit() {
  }

  indicateready() {
    console.log('Ready!');
  }
}

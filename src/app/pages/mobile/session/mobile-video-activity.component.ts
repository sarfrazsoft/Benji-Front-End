import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {BackendService} from '../../../services/backend.service';

import {interval} from 'rxjs/internal/observable/interval';


@Component({
  selector: 'app-desktop-activity-title',
  template:
  '<div class="mobile-content-wrap">\n' +
  '    <div class="mobile-content-wrap-center"><img src="assets/img/cam.png" height="100">\n' +
  '    <h1 class="heading-2">Tune in</h1>\n' +
  '    <div class="mobile-text">{{ activityDetails.current_activity.description }}<br></div>\n' +
  '</div>\n',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileVideoActivityComponent implements OnInit, OnDestroy {
  public activityDetails;
  public sessionDetails;

  constructor(private backend: BackendService, private _sanitizer: DomSanitizer) {
    this.activityDetails = {'activity': {'videoactivity': {'video_link': 'http://youtube.com'}}};
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  dataInit() {
  }

  nextActivity() {
  }
}

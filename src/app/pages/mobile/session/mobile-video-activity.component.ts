import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';



@Component({
  selector: 'app-mobile-activity-video',
  template:
  '<div class="mobile-content-wrap">\n' +
  '    <div class="mobile-content-wrap-center"><img src="assets/img/cam.png" height="100">\n' +
  '    <h1 class="heading-2">Tune in</h1>\n' +
  '    <div class="mobile-text">{{ activityDetails.description }}<br></div>\n' +
  '</div>\n',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileVideoActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy {

  constructor() { super(); }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}

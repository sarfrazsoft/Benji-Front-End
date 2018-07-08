import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';

import { BaseActivityComponent } from '../../shared/base-activity.component';


@Component({
  selector: 'app-mobile-activity-title',
  template: '<div class="mobile-content-wrap-wide">\n' +
  '    <h1 class="heading-2">{{ sessionDetails.session.session_name }}</h1>\n' +
  '      <div class="mobile-text">Get ready to begin! </div>\n' +
  '     </div>\n',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileTitleComponent extends BaseActivityComponent implements OnInit, OnDestroy {

  constructor() { super(); }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}

import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';

import { BaseActivityComponent } from '../../../shared/base-activity.component';


@Component({
  selector: 'app-participant-activity-title',
  templateUrl: './participant-title.component.html' ,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class ParticipantTitleComponent extends BaseActivityComponent implements OnInit, OnDestroy {

  constructor() { super(); }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}

import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import { BaseActivityComponent } from '../../../../shared/base-activity.component';



@Component({
  selector: 'app-participant-activity-video',
  templateUrl: './participant-video-activity.component.html',
  styleUrls: [
    './participant-video-activity.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class ParticipantVideoActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy {

  constructor() { super(); }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}

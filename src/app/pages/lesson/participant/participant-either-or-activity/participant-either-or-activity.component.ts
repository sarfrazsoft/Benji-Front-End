import { Component, OnChanges, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-participant-either-or-activity',
  templateUrl: './participant-either-or-activity.component.html',
  styleUrls: ['./participant-either-or-activity.component.scss']
})
export class ParticipantEitherOrActivityComponent extends BaseActivityComponent {
  constructor() {
    super();
  }
}

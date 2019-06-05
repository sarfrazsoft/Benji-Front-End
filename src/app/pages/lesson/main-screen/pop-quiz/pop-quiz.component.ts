import { Component, OnChanges, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-pop-quiz',
  templateUrl: './pop-quiz.component.html',
  styleUrls: ['./pop-quiz.component.scss']
})
export class MainScreenPopQuizComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  radialTimer;
  constructor() {
    super();
  }

  optionIdentifiers = ['A', 'B', 'C', 'D', 'E', 'F'];

  ngOnInit() {}

  ngOnChanges() {
    const as = this.activityState;
    if (
      as.mcqactivity.question_timer &&
      (as.mcqactivity.question_timer.status === 'running' ||
        as.mcqactivity.question_timer.status === 'paused')
    ) {
      this.radialTimer = as.mcqactivity.question_timer;
    } else if (
      as.base_activity.next_activity_start_timer &&
      (as.base_activity.next_activity_start_timer.status === 'running' ||
        as.base_activity.next_activity_start_timer.status === 'paused')
    ) {
      this.radialTimer = as.base_activity.next_activity_start_timer;
    }
    console.log(this.activityState);
  }
}

import { Component, OnChanges, ViewEncapsulation } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-activity-video',
  templateUrl: './video-activity.component.html',
  styleUrls: ['./video-activity.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParticipantVideoActivityComponent extends BaseActivityComponent
  implements OnChanges {
  singleUserActivity;
  constructor() {
    super();
  }

  ngOnChanges() {
    this.singleUserActivity = this.activityState.lesson.single_user_lesson;
  }
}

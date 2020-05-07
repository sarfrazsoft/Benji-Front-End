import { Component, OnChanges, ViewEncapsulation } from '@angular/core';
import { ContextService } from 'src/app/services';
import { Timer } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-activity-video',
  templateUrl: './video-activity.component.html',
  styleUrls: ['./video-activity.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantVideoActivityComponent extends BaseActivityComponent
  implements OnChanges {
  singleUserActivity;
  constructor(private contextService: ContextService) {
    super();
  }

  ngOnChanges() {
    this.contextService.activityTimer = { status: 'cancelled' } as Timer;
    this.singleUserActivity = this.activityState.lesson.single_user_lesson;
  }
}

import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ContextService, EmojiLookupService } from 'src/app/services';
import { Timer } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-title-activity',
  templateUrl: './title-activity.component.html',
  styleUrls: ['./title-activity.component.scss'],
})
export class ParticipantTitleActivityComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  constructor(
    public emoji: EmojiLookupService,
    private contextService: ContextService
  ) {
    super();
  }

  ngOnInit() {}

  ngOnChanges() {
    const act = this.activityState;
    if (act.titleactivity.hide_timer) {
      this.contextService.activityTimer = { status: 'cancelled' } as Timer;
    } else {
      const timer = this.activityState.base_activity.next_activity_start_timer;
      this.contextService.activityTimer = timer;
    }
  }
}

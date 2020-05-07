import { Component, OnInit, ViewChild } from '@angular/core';
import { ContextService, EmojiLookupService } from 'src/app/services';
import { Timer } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-title-activity',
  templateUrl: './title-activity.component.html',
  styleUrls: ['./title-activity.component.scss'],
})
export class ParticipantTitleActivityComponent extends BaseActivityComponent
  implements OnInit {
  constructor(
    public emoji: EmojiLookupService,
    private contextService: ContextService
  ) {
    super();
  }

  ngOnInit() {
    this.contextService.activityTimer = { status: 'cancelled' } as Timer;
  }
}

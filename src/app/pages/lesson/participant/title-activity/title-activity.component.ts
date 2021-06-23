import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ContextService, EmojiLookupService } from 'src/app/services';
import { Timer } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import { TitleActivity } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-ps-title-activity',
  templateUrl: './title-activity.component.html',
})
export class ParticipantTitleActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {

  mainTitle = '';
  titleText = '';
  layout: any;
  title_emoji: string;
  title_image: any;

  constructor(public emoji: EmojiLookupService, private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    const act = this.activityState;
    this.loadVariables(act.titleactivity);
  }

  ngOnChanges() {
    const act = this.activityState;
    this.loadVariables(act.titleactivity);
    if (act.titleactivity.hide_timer) {
      this.contextService.activityTimer = { status: 'cancelled' } as Timer;
    } else {
      const timer = this.getNextActStartTimer();
      // this.contextService.activityTimer = timer;
    }
  }

  loadVariables(act: TitleActivity) {
    this.mainTitle = act.main_title ? act.main_title : '';
    this.titleText = act.title_text ? act.title_text : '';
    this.title_emoji = act.title_emoji ? act.title_emoji : '';
    this.title_image = act.title_image ? act.title_image : '';
    this.layout = act.layout ? act.layout : '';
    console.log(this.layout);
  }

}

import { Component, OnChanges, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-feedback-activity',
  templateUrl: './feedback-activity.component.html',
})
export class MainScreenFeedbackActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {
  title = '';
  title_emoji = '';
  instructions = '';
  answeredParticipantsLength = null;
  participantLength = null;
  constructor() {
    super();
  }
  ngOnInit() {
    super.ngOnInit();
    this.changes();
  }

  changes() {
    const act = this.activityState.feedbackactivity;
    console.log(act);
    this.title_emoji = act.title_emoji ? act.title_emoji : '';
    if (act) {
      this.title = act.titlecomponent.title;
      this.instructions = act.titlecomponent.screen_instructions;
      this.answeredParticipantsLength = act.answered_participants.length;
      this.participantLength = this.activityState.lesson_run.participant_set.length;
    }
  }
  ngOnChanges() {
    this.changes();
  }
}

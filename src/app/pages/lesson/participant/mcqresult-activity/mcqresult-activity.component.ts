import { Component, OnChanges, OnInit } from '@angular/core';
import { ContextService } from 'src/app/services';
import { Timer } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-mcqresult-activity',
  templateUrl: './mcqresult-activity.component.html',
})
export class ParticipantMcqresultActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  showStatistics = false;
  activityType;
  constructor(private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.contextService.activityTimer = { status: 'cancelled' } as Timer;
    this.activityType =
      this.getActivityType() === 'PollResultsActivity' ? 'pollresultsactivity' : 'mcqresultsactivity';
  }
  ngOnChanges() {
    this.activityType =
      this.getActivityType() === 'PollResultsActivity' ? 'pollresultsactivity' : 'mcqresultsactivity';
    const act = this.activityState[this.activityType];

    if (act.poll_mode) {
      this.showStatistics = true;
    }
  }
  getUserScore() {
    const scoreCard = this.activityState[this.activityType].results_summary.find((r) => {
      return r.participant_code === this.getParticipantCode();
    });

    return scoreCard.score;
  }

  getTotalQuestions() {
    return this.activityState[this.activityType].total;
  }

  getPercentageScore() {
    return (this.getUserScore() / this.getTotalQuestions()) * 100;
  }
}

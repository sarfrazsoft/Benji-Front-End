import { Component, OnChanges, OnInit } from '@angular/core';
import { ContextService } from 'src/app/services';
import { Timer } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-mcqresult-activity',
  templateUrl: './mcqresult-activity.component.html',
  styleUrls: ['./mcqresult-activity.component.scss'],
})
export class ParticipantMcqresultActivityComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  showStatistics = false;
  constructor(private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    this.contextService.activityTimer = { status: 'cancelled' } as Timer;
  }
  ngOnChanges() {
    const act = this.activityState.mcqresultsactivity;

    if (act.poll_mode) {
      this.showStatistics = true;
    }
  }
  getUserScore() {
    const scoreCard = this.activityState.mcqresultsactivity.results_summary.find(
      (r) => {
        return r.id === this.activityState.your_identity.id;
      }
    );

    return scoreCard.score;
  }

  getTotalQuestions() {
    return this.activityState.mcqresultsactivity.total;
  }

  getPercentageScore() {
    return (this.getUserScore() / this.getTotalQuestions()) * 100;
  }
}

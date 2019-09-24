import { Component, OnChanges, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-mcqresult-activity',
  templateUrl: './mcqresult-activity.component.html',
  styleUrls: ['./mcqresult-activity.component.scss']
})
export class ParticipantMcqresultActivityComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  showStatistics = false;
  constructor() {
    super();
  }

  ngOnInit() {}
  ngOnChanges() {
    const act = this.activityState.mcqresultsactivity;

    if (act.poll_mode) {
      this.showStatistics = true;
    }
  }
  getUserScore() {
    const scoreCard = this.activityState.mcqresultsactivity.results_summary.find(
      r => {
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

import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-participant-mcqresult-activity',
  templateUrl: './participant-mcqresult-activity.component.html',
  styleUrls: ['./participant-mcqresult-activity.component.scss']
})
export class ParticipantMcqresultActivityComponent extends BaseActivityComponent
  implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
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

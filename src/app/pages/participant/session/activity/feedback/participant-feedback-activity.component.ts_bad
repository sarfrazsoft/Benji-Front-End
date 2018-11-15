import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import { BaseActivityComponent } from '../../../../shared/base-activity.component';
import {BackendService} from '../../../../../services/backend.service';

@Component({
  selector: 'app-participant-activity-feedback',
  templateUrl: './participant-feedback-activity.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class ParticipantFeedbackActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy {
  feedback_q1;
  feedback_q2;
  q1_ans;
  q2_ans;
  qIndex = 0;

  constructor(private backend: BackendService) { super(); }

  ngOnInit() {
    this.refreshQs();
  }

  ngOnDestroy() {
  }

  submitAnswer() {
    if (this.feedback_q1) {
      this.backend.set_activity_user_parameter(this.activityRun.id, 'answer_' + (this.qIndex * 2), this.q1_ans).subscribe();
    }
    if (this.feedback_q2) {
      this.backend.set_activity_user_parameter(this.activityRun.id, 'answer_' + (this.qIndex * 2 + 1), this.q2_ans).subscribe();
    }
    this.qIndex++;
    this.refreshQs();
  }

  refreshQs() {
    const feedbackActivityPrompts = this.activityDetails.feedbackactivity.feedbackprompt_set;
    this.q1_ans = null;
    this.q2_ans = null;
    this.feedback_q1 = null;
    this.feedback_q2 = null;

    if (this.qIndex * 2 < feedbackActivityPrompts.length) {
      this.feedback_q1 = feedbackActivityPrompts[this.qIndex * 2];
      if (this.qIndex * 2 + 1 < feedbackActivityPrompts.length) {
        this.feedback_q2 = feedbackActivityPrompts[this.qIndex * 2 + 1];
      }
    } else {
      return;
    }
    return;
  }


}

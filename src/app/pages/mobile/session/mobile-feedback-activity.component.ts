import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import {BackendService} from '../../../services/backend.service';

@Component({
  selector: 'app-mobile-activity-feedback',
  template:
  '<div class="mobile-content-wrap-wide" *ngIf="feedback_q1 || feedback_q2">\n' +
  '      <h1 class="benji-blue-header">Review</h1>\n' +
  '      <div class="form-block-2 w-form">\n' +
  '        <form id="feedback-form" name="feedback-form" data-name="Feedback Form">\n' +
  '          <app-feedback-prompt *ngIf="feedback_q1" [prompt]="feedback_q1" (value)="q1_ans = $event"></app-feedback-prompt>' +
  '          <app-feedback-prompt *ngIf="feedback_q2" [prompt]="feedback_q2" (value)="q2_ans = $event"></app-feedback-prompt>' +
  '          <input type="button" value="Submit"  (click)="submitAnswer()" class="benji-blue-button w-button">' +
  '        </form>\n' +
  '    </div>\n' +
  '</div>' +
  '<div class="mobile-content-wrap" *ngIf="!feedback_q1 && !feedback_q2">\n' +
  '    <div class="mobile-content-wrap-wide"><img src="assets/img/party-popper_1f389.png" height="100">\n' +
  '      <h1 class="heading-2">Thanks!</h1>\n' +
  '      <div class="mobile-text">Thank you for sharing your feedback!</div>\n' +
  '  </div>',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileFeedbackActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy {
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

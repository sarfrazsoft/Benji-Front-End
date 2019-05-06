import { Component, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  FeedbackActivity,
  FeedbackQuestion,
  FeedbackSubmitEvent,
  FeedbackSubmitEventAnswer
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-feedback-activity',
  templateUrl: './feedback-activity.component.html',
  styleUrls: ['./feedback-activity.component.scss']
})
export class ParticipantFeedbackActivityComponent extends BaseActivityComponent
  implements OnInit {
  feedbackSubmitted: boolean;

  constructor(private builder: FormBuilder) {
    super();
  }

  ngOnInit() {}

  submitFeedback(event) {
    this.sendMessage.emit(event);
    this.feedbackSubmitted = true;
  }
}

import { Component } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'app-participant-feedback-activity',
  templateUrl: './participant-feedback-activity.component.html',
  styleUrls: ['./participant-feedback-activity.component.scss']
})
export class ParticipantFeedbackActivityComponent extends BaseActivityComponent {
  public feedbackSubmitted: boolean;
}

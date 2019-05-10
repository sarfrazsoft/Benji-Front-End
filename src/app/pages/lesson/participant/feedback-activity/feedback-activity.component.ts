import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-feedback-activity',
  templateUrl: './feedback-activity.component.html',
  styleUrls: ['./feedback-activity.component.scss']
})
export class ParticipantFeedbackActivityComponent extends BaseActivityComponent
  implements OnInit {
  answersSubmitted: boolean;

  constructor() {
    super();
  }

  ngOnInit() {}

  submitAnswers(event) {
    this.sendMessage.emit(event);
    this.answersSubmitted = true;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import {
  ActivityReport,
  FeedbackQuestionSet
} from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  @Input() data: ActivityReport;

  fback: Array<FeedbackQuestionSet>;
  constructor() {}

  ngOnInit() {
    if (this.data && this.data.feedback) {
      this.fback = this.data.feedback.feedbackquestion_set;
    }
  }
}

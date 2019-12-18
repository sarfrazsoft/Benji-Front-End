import { Component, Input, OnInit } from '@angular/core';
import {
  ActivityReport,
  FeedbackQuestionSet
} from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-feedback-graph',
  templateUrl: './feedback-graph.component.html',
  styleUrls: ['./feedback-graph.component.scss']
})
export class FeedbackGraphComponent implements OnInit {
  @Input() fback: Array<FeedbackQuestionSet>;
  @Input() showAvg = false;
  @Input() userFilter = false;

  constructor() {}

  ngOnInit() {
    // if (this.data && this.data.feedback) {
    //   this.fback = this.data.feedback.feedbackquestion_set;
    // }
  }
}

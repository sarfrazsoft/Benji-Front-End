import { Component, Input, OnInit } from '@angular/core';
import { FeedbackQuestionSet } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-generic-feedback-graph',
  templateUrl: './generic-feedback-graph.component.html',
  styleUrls: ['./generic-feedback-graph.component.scss'],
})
export class FeedbackGenericGraphComponent implements OnInit {
  @Input() fback: Array<FeedbackQuestionSet>;
  @Input() instructions: string;
  @Input() showAvg = false;
  @Input() userFilter = false;
  @Input() cardTitle = '';

  constructor() {
    // console.log(this.fback);
  }

  ngOnInit() {}
}

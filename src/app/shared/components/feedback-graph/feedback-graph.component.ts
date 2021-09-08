import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FeedbackQuestionSet } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-feedback-graph',
  templateUrl: './feedback-graph.component.html',
  styleUrls: ['./feedback-graph.component.scss'],
})
export class FeedbackGraphComponent implements OnInit, OnChanges {
  @Input() fback: Array<FeedbackQuestionSet | any>;
  @Input() showAvg = false;
  @Input() userFilter = false;
  @Input() cardTitle = '';

  constructor() {}

  ngOnInit() {}
  ngOnChanges() {}
}

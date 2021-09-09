import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FeedbackGraphQuestion, User } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-report-mcq',
  templateUrl: './report-mcq.component.html',
})
export class ReportMCQComponent implements OnInit, AfterViewInit {
  @Input() question: FeedbackGraphQuestion | any;
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {}
}

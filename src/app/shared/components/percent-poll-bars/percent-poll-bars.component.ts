import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PastSessionsService } from 'src/app/services';
import {
  ActivityReport,
  MCQActivityParticipantAnswerSet,
  MCQReport,
  PollReport,
} from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-percent-poll-bars',
  templateUrl: './percent-poll-bars.component.html',
})
export class PercentPollBarsComponent implements OnInit {
  @Input() question;

  constructor(private pastSessionService: PastSessionsService) {}

  ngOnInit() {}
}

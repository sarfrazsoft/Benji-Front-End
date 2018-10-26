import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-participant-feedback-activity',
  templateUrl: './participant-feedback-activity.component.html',
  styleUrls: ['./participant-feedback-activity.component.scss']
})
export class ParticipantFeedbackActivityComponent implements OnInit {
  public feedbackSubmitted: boolean;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'submitted-counter',
  templateUrl: './submitted-counter.component.html',
})
export class SubmittedCounterComponent implements OnChanges {
  @Input()
  unansweredParticipants = [];
  @Input()
  answeredParticipants = [];
  
  ngOnChanges() {
    if (!this.unansweredParticipants) {
      this.unansweredParticipants = [];
    } 
    if (!this.answeredParticipants) {
      this.answeredParticipants = [];
    } 
  }
}

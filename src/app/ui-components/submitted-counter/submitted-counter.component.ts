import { Component, Input } from '@angular/core';

@Component({
  selector: 'submitted-counter',
  templateUrl: './submitted-counter.component.html',
})
export class SubmittedCounterComponent {
  @Input()
  unansweredParticipants: [];
  @Input()
  answeredParticipants: [];
  
}

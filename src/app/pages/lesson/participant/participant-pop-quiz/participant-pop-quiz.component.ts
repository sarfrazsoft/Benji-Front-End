import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-participant-pop-quiz',
  templateUrl: './participant-pop-quiz.component.html',
  styleUrls: ['./participant-pop-quiz.component.scss']
})
export class ParticipantPopQuizComponent extends BaseActivityComponent
  implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}

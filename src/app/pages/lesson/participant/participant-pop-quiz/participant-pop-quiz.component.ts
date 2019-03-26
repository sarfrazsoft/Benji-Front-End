import { Component, OnInit } from '@angular/core';
import { MCQSubmitAnswerEvent } from 'src/app/services/backend/schema/messages';
import { MCQChoice } from 'src/app/services/backend/schema/utils';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-participant-pop-quiz',
  templateUrl: './participant-pop-quiz.component.html',
  styleUrls: ['./participant-pop-quiz.component.scss']
})
export class ParticipantPopQuizComponent extends BaseActivityComponent
  implements OnInit {
  selectedAnswerId;
  revealAnswer = false;

  constructor() {
    super();
  }

  optionIdentifiers = ['A', 'B', 'C', 'D'];

  ngOnInit() {}

  submitAnswer(option: MCQChoice) {
    // this.revealAnswer = true;
    this.selectedAnswerId = option.id;
    this.sendMessage.emit(new MCQSubmitAnswerEvent(option));
  }
}

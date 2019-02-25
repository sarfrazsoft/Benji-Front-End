import { Component } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import {MCQSubmitAnswerEvent} from '../../../../services/backend/schema/messages';
import {MCQChoice} from '../../../../services/backend/schema/utils';

@Component({
  selector: 'app-participant-mcq-activity',
  templateUrl: './participant-mcq-activity.component.html',
  styleUrls: ['./participant-mcq-activity.component.scss']
})
export class ParticipantMcqActivityComponent extends BaseActivityComponent {
  selectedAnswer: MCQChoice;

  questionTimerInit(timer) {
    const questionSeconds =
      (Date.parse(this.activityState.mcqactivity.question_timer.expiration_time) -
        Date.now()) /
      1000;
    timer.startTimer(questionSeconds);
  }

  revealTimerInit(timer) {
    const revealSeconds =
      (Date.parse(this.activityState.base_activity.next_activity_start_timer.expiration_time) - Date.now()) /
      1000;
    timer.startTimer(revealSeconds);
  }

  reveal() {
    return (
      this.activityState.base_activity.next_activity_start_timer !== null &&
      this.activityState.base_activity.next_activity_start_timer !== undefined
    );
  }

  correctChoice() {
    return this.activityState.mcqactivity.question.mcqchoice_set.find(
      choice => choice.is_correct
    );
  }

  public submitAnswer(answer) {
    if (!this.reveal()) {
      this.selectedAnswer = answer;
      this.sendMessage.emit(new MCQSubmitAnswerEvent(answer));
    }
  }
}

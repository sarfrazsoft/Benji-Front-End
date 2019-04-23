import { Component } from '@angular/core';
import {
  MCQChoice,
  MCQSubmitAnswerEvent
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-mcq-activity',
  templateUrl: './mcq-activity.component.html',
  styleUrls: ['./mcq-activity.component.scss']
})
export class ParticipantMcqActivityComponent extends BaseActivityComponent {
  selectedAnswer: MCQChoice;

  questionTimerInit(timer) {
    const questionSeconds =
      (Date.parse(this.activityState.mcqactivity.question_timer.end_time) -
        Date.now()) /
      1000;
    timer.startTimer(questionSeconds);
  }

  revealTimerInit(timer) {
    const revealSeconds =
      (Date.parse(
        this.activityState.base_activity.next_activity_start_timer.end_time
      ) -
        Date.now()) /
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

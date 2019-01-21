import { Component } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'app-participant-mcq-activity',
  templateUrl: './participant-mcq-activity.component.html',
  styleUrls: ['./participant-mcq-activity.component.scss']
})
export class ParticipantMcqActivityComponent extends BaseActivityComponent {
  selectedAnswer;

  questionTimerInit(timer) {
    const questionSeconds =
      (Date.parse(this.activityState.activity_status.countdown_time) -
        Date.now()) /
      1000;
    timer.startTimer(questionSeconds);
  }

  revealTimerInit(timer) {
    const revealSeconds =
      (Date.parse(this.activityState.activity_status.pause_time) - Date.now()) /
      1000;
    timer.startTimer(revealSeconds);
  }

  reveal() {
    return (
      this.activityState.activity_status.pause_time !== null &&
      this.activityState.activity_status.pause_time !== undefined
    );
  }

  correctChoice() {
    return this.activityState.activity_status.question.choices.find(
      choice => choice.is_correct
    );
  }

  public submitAnswer(answer) {
    if (!this.reveal()) {
      this.selectedAnswer = answer;
      this.sendMessage.emit({ event: 'submit_answer', answer: answer.id });
    }
  }
}

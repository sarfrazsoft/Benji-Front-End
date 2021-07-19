import { Component, OnChanges, OnInit } from '@angular/core';
import { FeedbackSubmitEvent, FeedbackSubmitEventAnswer } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-feedback-activity',
  templateUrl: './feedback-activity.component.html',
})
export class ParticipantFeedbackActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {
  answersSubmitted: boolean;

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.answersSubmitted = false;
    const uId = this.getUserId();
    const x = this.activityState.feedbackactivity.answered_participants.filter(
      (u) => u.participant_code === uId
    ).length;
    if (x) {
      this.answersSubmitted = true;
    }
  }

  ngOnChanges() {
    this.timer = this.getTimerTool();
  }

  getUserId(): number {
    return this.getParticipantCode();
  }

  submitAnswers(val) {
    const answers: Array<FeedbackSubmitEventAnswer> = [];
    for (let i = 0; i < val.questions.length; i++) {
      if (val.questions[i].question_type === 'rating_agreedisagree') {
        const ans = new FeedbackSubmitEventAnswer(
          val.questions[i].q,
          val.questions[i].rating_answer,
          val.questions[i].text_answer
        );
        answers.push(ans);
      }
      if (val.questions[i].question_type === 'text_only') {
        const ans = new FeedbackSubmitEventAnswer(
          val.questions[i].q,
          val.questions[i].rating_answer,
          val.questions[i].text_answer
        );
        answers.push(ans);
      }
      if (val.questions[i].question_type === 'scale') {
        const ans = new FeedbackSubmitEventAnswer(
          val.questions[i].q,
          val.questions[i].rating_answer,
          val.questions[i].text_answer
        );
        answers.push(ans);
      }
      if (val.questions[i].question_type === 'multiple_choice') {
        const ans = new FeedbackSubmitEventAnswer(
          val.questions[i].q,
          val.questions[i].rating_answer,
          val.questions[i].text_answer
        );
        answers.push(ans);
      }
    }
    this.sendMessage.emit(new FeedbackSubmitEvent(answers));
    this.answersSubmitted = true;
  }
}

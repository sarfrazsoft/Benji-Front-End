import { Component, OnInit } from '@angular/core';
import { FeedbackSubmitEvent, FeedbackSubmitEventAnswer } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-feedback-activity',
  templateUrl: './feedback-activity.component.html',
  styleUrls: ['./feedback-activity.component.scss'],
})
export class ParticipantFeedbackActivityComponent extends BaseActivityComponent implements OnInit {
  answersSubmitted: boolean;

  constructor() {
    super();
  }

  ngOnInit() {
    this.answersSubmitted = false;
    const uId = this.getUserId();
    // this.activityState.feedbackactivity.answered_users.includes()
  }

  getUserId(): number {
    return this.activityState.your_identity.id;
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
      if (val.questions[i].question_type === 'text') {
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

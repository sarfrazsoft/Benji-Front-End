import { Component, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  FeedbackActivity,
  FeedbackQuestion,
  FeedbackSubmitEvent,
  FeedbackSubmitEventAnswer
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-feedback-activity',
  templateUrl: './feedback-activity.component.html',
  styleUrls: ['./feedback-activity.component.scss']
})
export class ParticipantFeedbackActivityComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  form: FormGroup;
  fback: FeedbackActivity;
  feedbackSubmitted: boolean;

  constructor(private builder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges() {
    this.fback = this.activityState.feedbackactivity;
  }

  buildForm() {
    const question_set = this.activityState.feedbackactivity
      .feedbackquestion_set;

    this.form = this.builder.group({
      questions: this.builder.array([])
    });

    for (let i = 0; i < question_set.length; i++) {
      const question = question_set[i];
      this.addItem(question);
    }
  }

  createQuestion(q: FeedbackQuestion): FormGroup {
    return this.builder.group({
      q: q,
      question_type: q.question_type,
      rating_answer: null,
      text_answer: null
    });
  }

  addItem(q: FeedbackQuestion): void {
    const questions = this.form.get('questions') as FormArray;
    questions.push(this.createQuestion(q));
  }

  get questions() {
    return this.form.get('questions') as FormArray;
  }

  submitFeedback() {
    const val = this.form.value;
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
    this.feedbackSubmitted = true;
  }
}

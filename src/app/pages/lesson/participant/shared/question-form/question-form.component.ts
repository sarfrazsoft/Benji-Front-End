import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  FeedbackActivity,
  FeedbackQuestion,
  FeedbackSubmitEvent,
  FeedbackSubmitEventAnswer
} from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss']
})
export class QuestionFormComponent implements OnInit, OnChanges {
  @Input() activity: FeedbackActivity;
  @Output() submitResponse = new EventEmitter();
  form: FormGroup;
  fback: FeedbackActivity;
  feedbackSubmitted: boolean;
  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges() {
    this.fback = this.activity;
  }

  buildForm() {
    const question_set = this.activity.feedbackquestion_set;

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
    this.submitResponse.emit(new FeedbackSubmitEvent(answers));
    this.feedbackSubmitted = true;
  }
}

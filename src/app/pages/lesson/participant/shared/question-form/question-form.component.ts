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
  @Input() question_set;
  @Output() submitResponse = new EventEmitter();
  form: FormGroup;
  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges() {}

  buildForm() {
    this.form = this.builder.group({
      questions: this.builder.array([])
    });

    for (let i = 0; i < this.question_set.length; i++) {
      const question = this.question_set[i];
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
    this.submitResponse.emit(val);
  }
}

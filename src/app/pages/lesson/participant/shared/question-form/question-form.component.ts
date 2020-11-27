import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FeedbackQuestion } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
})
export class QuestionFormComponent implements OnInit, OnChanges {
  @Input() question_set;
  @Output() submitResponse = new EventEmitter();
  sliderValue = 0;
  form: FormGroup;
  selectPills = selectPills;
  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges() {
    // check if the questions have ids
    // questions coming from editor don't have ids
    if (this.question_set.length && this.question_set[0].id) {
      this.question_set.sort((a, b) => a.id - b.id);
    }
  }

  buildForm() {
    this.form = this.builder.group({
      questions: this.builder.array([]),
    });

    for (let i = 0; i < this.question_set.length; i++) {
      const question = this.question_set[i];
      this.addItem(question);
    }
  }

  createQuestion(q: FeedbackQuestion): FormGroup {
    return this.builder.group(
      {
        q: q,
        question_type: q.question_type,
        rating_answer: null,
        text_answer: null,
      },
      {
        validator: (formGroup: FormGroup) => {
          return this.validateForm(formGroup);
        },
      }
    );
  }

  addItem(q: FeedbackQuestion): void {
    const questions = this.form.get('questions') as FormArray;
    questions.push(this.createQuestion(q));
  }

  get questions() {
    return this.form.get('questions') as FormArray;
  }

  validateForm(formgroup: FormGroup) {
    if (formgroup.controls['rating_answer'].value || formgroup.controls['text_answer'].value) {
      return null;
    } else {
      return { validateForm: true };
    }
  }

  submitFeedback() {
    if (this.form.valid) {
      const val = this.form.value;
      this.submitResponse.emit(val);
    }
    // console.log(this.selectPills);
  }

  selectPill(pill) {
    const idx = selectPills.findIndex((x) => x.id === pill.id);
    this.selectPills[idx].selected = !this.selectPills[idx].selected;
  }

  sliderValueChange(sliderVal) {
    this.sliderValue = sliderVal.value;
  }

  getSliderText() {
    const sliderTexts = [
      'one',
      'I didnt like  what I went through',
      'I m nuetral to coming here',
      'I cant decide if i liked it',
      'I like it but not sure',
      'I somewhat like it',
      'I like it',
      'I like it for sho',
      'I definitely like it ',
      'I love it',
      'I can\'t wait for the next one',
    ];
    return sliderTexts[Math.floor((this.sliderValue / 100) * sliderTexts.length)];
  }
}

export const selectPills = [
  { id: 1, name: 'Concise', selected: false },
  { id: 2, name: 'Clear', selected: false },
  { id: 3, name: 'very compelling', selected: false },
  { id: 4, name: 'Moose', selected: false },
  { id: 5, name: 'Thought provoking', selected: false },
  { id: 6, name: 'Enigma Machine', selected: false },
  { id: 7, name: 'Ten', selected: false },
];

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackQuestion } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class QuestionFormComponent implements OnInit, OnChanges {
  @Input() question_set;
  @Input() actEditor = false;
  heartRating = 0;
  emojiRating = 0;
  thumbRating;
  submitClicked;

  @Output() submitResponse = new EventEmitter();
  sliderValue = 0;
  form: FormGroup;
  selectPills = selectPills;

  heartsArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  starsArr = [1, 2, 3, 4, 5];
  tempHoverHeartRating = 0;

  tempHoverStarRating = 0;
  starRating = 0;

  mcqSelectedChoices = [];
  constructor(private builder: FormBuilder, private snackBar: MatSnackBar) {}

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

  addItem(q: FeedbackQuestion): void {
    const questions = this.form.get('questions') as FormArray;
    questions.push(this.createQuestion(q));
  }

  createQuestion(q: FeedbackQuestion): FormGroup {
    return this.builder.group(
      {
        q: q,
        question_type: q.question_type,
        rating_answer: null,
        text_answer: null,
        scale_answer: null,
        mcq_answer: null,
      },
      {
        validator: (formGroup: FormGroup) => {
          return this.validateForm(formGroup);
        },
      }
    );
  }

  onClickHeart(questionIndex: number, rating: number) {
    console.log(rating);
    this.setRating(questionIndex, rating);
    this.heartRating = rating;
  }
  onClickStar(questionIndex: number, rating: number) {
    this.setRating(questionIndex, rating);
    this.starRating = rating;
  }

  showStarIcon(index: number) {
    if (this.tempHoverStarRating || this.tempHoverStarRating === 0) {
      if (this.tempHoverStarRating >= index) {
        return 'star';
      } else {
        return 'star_border';
      }
    } else {
      if (this.starRating >= index) {
        return 'star';
      } else {
        return 'star_border';
      }
    }
  }

  mouseoverStarIcon(index: number) {
    this.tempHoverStarRating = index;
  }

  mouseoutStarIcon() {
    this.tempHoverStarRating = null;
  }

  mouseoverIcon(index: number) {
    this.tempHoverHeartRating = index;
  }

  mouseoutIcon() {
    this.tempHoverHeartRating = null;
  }

  showFavouriteIcon(index: number) {
    if (this.tempHoverHeartRating || this.tempHoverHeartRating === 0) {
      if (this.tempHoverHeartRating >= index) {
        return 'favorite';
      } else {
        return 'favorite_border';
      }
    } else {
      if (this.heartRating >= index) {
        return 'favorite';
      } else {
        return 'favorite_border';
      }
    }
  }

  // for Emoji type question
  onSentimentClick(questionIndex: number, sentiment: number) {
    this.setRating(questionIndex, sentiment);
    this.emojiRating = sentiment;
  }

  // for Thumbs up type questions
  onThumbClick(questionIndex: number, sentiment: number) {
    this.setRating(questionIndex, sentiment);
    this.thumbRating = sentiment;
  }

  setRating(questionIndex: number, sentiment: number) {
    const controlArray = <FormArray>this.form.get('questions');
    controlArray.controls[questionIndex].get('rating_answer').setValue(sentiment);
  }

  get questions() {
    return this.form.get('questions') as FormArray;
  }

  text_answer(questionIndex): AbstractControl {
    const controlArray = <FormArray>this.form.get('questions');
    return controlArray.controls[questionIndex].get('text_answer');
  }

  validateForm(formgroup: FormGroup) {
    if (formgroup.controls['question_type'].value === 'scale') {
      console.log(formgroup);
      const is_required = formgroup.controls['q'].value.is_required;
      if (!is_required) {
        return null;
      } else {
        if (formgroup.controls['scale_answer'].value) {
          return null;
        } else {
          return { validateForm: true, requred: true };
        }
      }
    } else if (formgroup.controls['question_type'].value === 'text_only') {
    } else {
      if (
        formgroup.controls['rating_answer'].value ||
        formgroup.controls['rating_answer'].value === 0 ||
        formgroup.controls['text_answer'].value ||
        formgroup.controls['mcq_answer'].value
      ) {
        return null;
      } else {
        return { validateForm: true };
      }
    }
  }

  submitFeedback() {
    this.submitClicked = true;
    if (this.form.valid) {
      const val = this.form.value;
      this.submitResponse.emit(val);
    }
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

  getScaleMin(question) {
    if (question.question_json && question.question_json.scale_json) {
      return question.question_json.scale_json.from;
    }
  }

  getScaleMax(question) {
    if (question.question_json && question.question_json.scale_json) {
      return question.question_json.scale_json.to;
    }
  }

  getScaleLabels(question) {
    if (question.question_json && question.question_json.scale_json) {
      return question.question_json.scale_json.labels;
    }
  }

  scaleChanged(value, questionIndex) {
    const controlArray = <FormArray>this.form.get('questions');
    controlArray.controls[questionIndex].get('scale_answer').setValue(value.value);
  }

  mcqChoiceSelect(questionIndex: number, choiceObject) {
    const controlArray = <FormArray>this.form.get('questions');
    if (choiceObject.isMultiSelect) {
      const index = this.mcqSelectedChoices.indexOf(choiceObject.selectedChoiceId);
      if (index > -1) {
        this.mcqSelectedChoices.splice(index, 1);
      } else {
        this.mcqSelectedChoices.push(choiceObject.selectedChoiceId);
      }
    } else {
      this.mcqSelectedChoices = [choiceObject.selectedChoiceId];
    }
    controlArray.controls[questionIndex].get('mcq_answer').setValue(this.mcqSelectedChoices);
  }

  getMCQChoices(question) {
    const json = JSON.parse(question.question_json);
    return json.mcqchoices ? json.mcqchoices : [];
  }

  isChoiceSelected(question, choice) {}
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

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase, QuestionSet } from '../../services/question-control.service';

@Component({
  selector: 'benji-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.scss'],
})
export class DynamicFormQuestionComponent implements OnInit {
  @Input() question: QuestionBase<string>;
  @Input() form: FormGroup;
  // selectedEmoji = null;
  showemoji;
  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
  constructor() {}

  ngOnInit() {
    // console.log(this.question);
  }
  logErrors() {
    // console.log(this.form.controls[this.question.key]);
  }

  getSelectedEmoji() {
    return this.form.controls[this.question.key].value;
  }

  addEmoji($event, formInputName) {
    // console.log($event);
    this.form.controls[formInputName].setValue('emoji://' + $event.emoji.unified);
    // this.selectedEmoji = 'emoji://' + $event.emoji.unified;
    this.showemoji = false;
  }

  stop(event) {
    event.stopPropagation();
  }
}

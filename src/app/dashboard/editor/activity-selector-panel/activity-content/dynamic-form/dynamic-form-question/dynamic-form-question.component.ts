import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../../services/question-control.service';

@Component({
  selector: 'benji-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.scss'],
})
export class DynamicFormQuestionComponent implements OnInit {
  @Input() question: QuestionBase<string>;
  @Input() form: FormGroup;
  selectedEmoji = null;
  showemoji;
  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
  constructor() {}

  ngOnInit() {}
  logErrors() {
    console.log(this.form.controls[this.question.key]);
  }

  addEmoji($event, formInputName) {
    console.log($event);
    this.form.controls[formInputName].setValue('emoji://' + $event.emoji.shortName);
    this.selectedEmoji = $event.emoji.shortName;
    this.showemoji = false;
  }
}

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase, QuestionControlService, QuestionSet } from '../services/question-control.service';

import { Store } from '@ngrx/store';
import { Activity } from '../../../models/';
import * as fromStore from '../../../store';
//
// TODO remove if not used anywhere
// remove by 25/9/2021
@Component({
  selector: 'benji-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() questions: Array<QuestionSet> = [];
  form: FormGroup;
  payLoad = '';
  typingTimer;
  @Output() submitActivityValues = new EventEmitter();

  constructor(private qcs: QuestionControlService, private store: Store<fromStore.EditorState>) {}

  ngOnInit() {}

  ngOnChanges() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  getFormGroup(question: QuestionSet) {
    // console.log(this.form.controls[question.key], question);
    if (question.key) {
      return this.form.controls[question.key];
    }
  }

  submit() {
    // we are going to update this activity to Overview panel
    // we'll need to know which activity is it corresponding to the overview panel activities.

    this.payLoad = JSON.stringify(this.form.getRawValue());
    const act = this.form.getRawValue();
    this.submitActivityValues.emit(act);
  }

  getQuestionPath(question) {}

  // on keyup, start the countdown
  typingStoped(event) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.submit();
    }, 1500);
  }

  // on keydown, clear the countdown
  typingStarted() {
    clearTimeout(this.typingTimer);
  }
  // doneTyping(submitCaseStudyDone?) {
  //     submitCaseStudyDone();
  // }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase, QuestionControlService } from '../services/question-control.service';

import { Store } from '@ngrx/store';
import { Activity } from '../../../models/';
import * as fromStore from '../../../store';

@Component({
  selector: 'benji-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {
  @Input() questions: QuestionBase<string>[] = [];
  form: FormGroup;
  payLoad = '';
  @Output() submitActivityValues = new EventEmitter();

  constructor(private qcs: QuestionControlService, private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  onSubmit() {
    // we are going to update this activity to Overview panel
    // we'll need to know which activity is it corresponding to the overview panel activities.

    this.payLoad = JSON.stringify(this.form.getRawValue());
    const act = this.form.getRawValue();
    this.submitActivityValues.emit(act);
  }
}

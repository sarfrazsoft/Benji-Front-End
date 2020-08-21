import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { FieldTypes } from '../../models/activity.model';
import * as fromStore from '../../store';
import {
  DropdownQuestion,
  EmojiQuestion,
  QuestionBase,
  QuestionControlService,
  TextboxQuestion,
  TimeQuestion,
} from './services/question-control.service';

import { of } from 'rxjs';

@Component({
  selector: 'benji-activity-content',
  templateUrl: './activity-content.component.html',
  styleUrls: ['./activity-content.component.scss'],
})
export class ActivityContentComponent implements OnInit {
  activity$: Observable<any>;
  fields$: Observable<any>;
  fieldTypes = FieldTypes;
  questions$: Observable<QuestionBase<any>[]>;
  showQuestions = false;

  constructor(private store: Store<fromStore.EditorState>, private qcs: QuestionControlService) {}

  ngOnInit() {
    this.activity$ = this.store.select(fromStore.getSelectedLessonActivity);

    this.fields$ = this.store.select(fromStore.getSelectedLessonActivityFields);

    // this.activity$.subscribe((x) => console.log(x));

    this.fields$.subscribe((x) => {
      if (x) {
      }
    });

    combineLatest(this.activity$, this.fields$, (activity, fields) => ({ activity, fields })).subscribe(
      (pair) => {
        if (pair.fields && pair.activity) {
          this.questions$ = this.getQuestions(pair.fields, pair.activity);
          this.showQuestions = true;
        }
      }
    );
  }

  getQuestions(fields, activity) {
    const questions1: QuestionBase<string>[] = [];
    console.log(fields, activity);
    fields.forEach((field) => {
      if (field.type === FieldTypes.string) {
        const f = this.getStringField(field, activity);
        questions1.push(f);
      } else if (field.type === FieldTypes.number) {
        const f = this.getNumberField(field);
        questions1.push(f);
      } else if (field.type === FieldTypes.boolean) {
        const f = this.getBooleanField(field);
      } else if (field.type === FieldTypes.emoji) {
        const f = this.getEmojiField(field);
        questions1.push(f);
      }
    });
    const dropdown = new DropdownQuestion({
      key: 'brave',
      label: 'Bravery Rating',
      options: [
        { key: 'solid', value: 'Solid' },
        { key: 'great', value: 'Great' },
        { key: 'good', value: 'Good' },
        { key: 'unproven', value: 'Unproven' },
      ],
      order: 3,
    });

    const tb = new TextboxQuestion({
      key: 'firstName',
      label: 'First name',
      value: 'Bombasto',
      required: true,
      order: 1,
    });

    const tb_1 = new TextboxQuestion({
      key: 'emailAddress',
      label: 'Email',
      type: 'email',
      order: 2,
    });
    const questions: QuestionBase<string>[] = [dropdown, tb];

    return of(questions1.sort((a, b) => a.order - b.order));
  }

  getStringField(field, activity): any {
    if (field.id === 'activity_id') {
      return new TextboxQuestion({
        key: 'activity_id',
        label: 'Activity ID',
        value: activity.activity.displayName,
        readonly: true,
        required: false,
        order: 1,
      });
    } else if (field.id === 'description') {
      return new TextboxQuestion({
        key: 'description',
        label: 'Description',
        value: '',
        required: false,
        order: 2,
      });
    } else {
      return new TextboxQuestion({
        key: field.id,
        label: field.id,
        value: '',
        required: field.required,
        order: 3,
      });
    }
  }

  getNumberField(field): any {
    return new TimeQuestion({
      key: field.id,
      label: field.id,
      type: 'number',
      value: 0,
      required: true,
      order: 4,
    });
  }

  getBooleanField(field): any {
    return new TextboxQuestion({
      key: field.id,
      label: field.id,
      value: '',
      required: field.required,
      order: 3,
    });
  }

  getEmojiField(field): any {
    return new EmojiQuestion({
      key: field.id,
      label: field.id,
      value: '',
      required: field.required,
      order: 3,
    });
  }
}

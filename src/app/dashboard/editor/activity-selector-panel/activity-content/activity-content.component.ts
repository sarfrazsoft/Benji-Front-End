import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { FieldTypes } from '../../models/activity.model';
import * as fromStore from '../../store';
import {
  CheckboxQuestion,
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
  content$: Observable<any>;
  fieldTypes = FieldTypes;
  questions$: Observable<QuestionBase<any>[]>;
  showQuestions = false;

  constructor(private store: Store<fromStore.EditorState>, private qcs: QuestionControlService) {}

  ngOnInit() {
    this.activity$ = this.store.select(fromStore.getSelectedLessonActivity);

    this.fields$ = this.store.select(fromStore.getSelectedLessonActivityFields);

    this.content$ = this.store.select(fromStore.getSelectedLessonActivityContent);

    // this.fields$.subscribe((fields) => {
    //   console.log(fields);
    //   if (fields) {
    //     // this.questions$ = this.getQuestions(fields);
    //     // this.showQuestions = true;
    //   }
    // });

    // this.activity$.subscribe((fields) => {
    //   console.log(fields);
    //   if (fields) {
    //     // this.questions$ = this.getQuestions(fields);
    //     // this.showQuestions = true;
    //   }
    // });
    combineLatest(this.activity$, this.fields$, this.content$, (activity, fields, content) => ({
      activity,
      fields,
      content,
    })).subscribe((pair) => {
      // console.log(pair);
      if (pair.fields && pair.activity.activity) {
        if (pair.content) {
          this.questions$ = this.getQuestions(pair.fields, pair.activity, pair.content);
        } else {
          this.questions$ = this.getQuestions(pair.fields, pair.activity);
        }
        this.showQuestions = true;
      }
    });
    // combineLatest(this.activity$, this.fields$, (activity, fields) => ({ activity, fields })).subscribe(
    //   (pair) => {
    //     if (pair.fields && pair.activity.activity) {
    //       this.questions$ = this.getQuestions(pair.fields, pair.activity);
    //       this.showQuestions = true;
    //     }
    //   }
    // );
  }

  saveValues($event) {
    console.log($event);
    // const lesson = [
    //   {
    //     activity_type: 'LobbyActivity',
    //     activity_id: 'lobby1',
    //     description: 'hello world',
    //   },
    //   { ...act, activity_type: act.activity_id },
    // ];
    this.store.dispatch(new fromStore.AddActivityContent($event));
  }

  getQuestions(fields, activity, content?) {
    const questions1: QuestionBase<string>[] = [];
    // console.log(fields, activity);
    fields.forEach((field) => {
      if (field.type === FieldTypes.string || field.type === FieldTypes.url) {
        questions1.push(this.getStringField(field, activity, content));
      } else if (field.type === FieldTypes.number) {
        questions1.push(this.getNumberField(field));
      } else if (field.type === FieldTypes.boolean) {
        questions1.push(this.getBooleanField(field));
      } else if (field.type === FieldTypes.emoji) {
        // questions1.push(this.getEmojiField(field));
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

    return of(questions1.sort((a, b) => a.order - b.order));
  }

  getStringField(field, activity, content?): any {
    if (field.id === 'activity_id') {
      return new TextboxQuestion({
        key: 'activity_id',
        label: 'Activity ID',
        value: activity.activity.id + '_' + activity.id,
        readonly: true,
        required: false,
        order: 1,
      });
    } else if (field.id === 'description') {
      return new TextboxQuestion({
        key: 'description',
        label: 'Description',
        value: content ? content['description'] : '',
        required: false,
        order: 2,
      });
    } else if (field.id === 'title_emoji') {
      return this.getEmojiField(field, activity, content);
    } else {
      return new TextboxQuestion({
        key: field.id,
        label: field.id,
        value: content ? content[field.id] : '',
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
    if (field.id === 'auto_next') {
      return new CheckboxQuestion({
        key: field.id,
        label: field.id,
        value: true,
        required: field.required,
        order: 3,
      });
    } else if (field.id === 'hide_timer') {
      return new CheckboxQuestion({
        key: field.id,
        label: field.id,
        value: false,
        required: field.required,
        order: 3,
      });
    }
  }

  getEmojiField(field, activity, content?): any {
    return new EmojiQuestion({
      key: field.id,
      label: field.id,
      value: content ? content[field.id] : '',
      required: field.required,
      order: 3,
    });
  }
}

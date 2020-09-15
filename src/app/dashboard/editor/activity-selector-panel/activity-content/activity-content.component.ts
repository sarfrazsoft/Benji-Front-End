import { WidgetLibraryService } from '@ajsf/core';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { FieldTypes } from '../../models/activity.model';
import * as fromStore from '../../store';
import { EmojiSelectorComponent } from './dynamic-form/emoji-selector/emoji-selector.component';
import {
  CheckboxQuestion,
  DropdownQuestion,
  EmojiQuestion,
  QuestionBase,
  QuestionControlService,
  QuestionSet,
  TextboxQuestion,
  TimeQuestion,
} from './services/question-control.service';

import { DIR_DOCUMENT } from '@angular/cdk/bidi';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { mapValues } from 'lodash';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'benji-activity-content',
  templateUrl: './activity-content.component.html',
  styleUrls: ['./activity-content.component.scss'],
})
export class ActivityContentComponent implements OnInit {
  constructor(
    private store: Store<fromStore.EditorState>,
    private qcs: QuestionControlService,
    widgetLibraryService: WidgetLibraryService,
    private formlyJsonschema: FormlyJsonschema
  ) {
    widgetLibraryService.registerWidget('emoji', EmojiSelectorComponent);
    this.myjsonSchema = {
      schema: {
        type: 'object',
        properties: {
          title_image: { type: 'string' },
          last_name: { type: 'string' },
        },
        required: ['last_name'],
      },
      // layout: [
      //   { key: 'title_image', type: 'emoji' },
      //   { key: 'last_name', type: 'text' },
      // ],
    };
  }
  activity$: Observable<any>;
  fields$: Observable<any>;
  content$: Observable<any>;
  fieldTypes = FieldTypes;
  questions$: Observable<Array<QuestionSet>>;
  showQuestions = false;

  myjsonSchema: any = {};

  form = new FormGroup({});
  model = { email: 'email@gmail.com' };
  fields: FormlyFieldConfig[];

  ngOnInit() {
    // create layout will ruturn an array
    this.myjsonSchema['layout'] = this.createFormLayout(this.myjsonSchema.schema);
    this.activity$ = this.store.select(fromStore.getSelectedLessonActivity);

    // this.fields$ = this.store.select(fromStore.getSelectedLessonActivityFields);

    this.content$ = this.store.select(fromStore.getSelectedLessonActivityContent);

    combineLatest([this.activity$, this.content$])
      .pipe(
        map(([a$, c$]) => ({
          activity: a$,
          content: c$,
        }))
      )
      .subscribe((pair) => {
        if (pair.activity.activity) {
          console.log(pair.activity.activity.schema);
          const x = { schema: pair.activity.activity };
          this.fields = [this.formlyJsonschema.toFieldConfig(formlyData.schema as any)];
          this.myjsonSchema = {
            schema: { properties: pair.activity.activity.schema.properties },
            layout: MCQLayout,
            data: MCQData,
          };
          console.log(this.myjsonSchema);
          this.showQuestions = true;
        }
      });
  }

  saveValues($event) {
    console.log($event);
    this.store.dispatch(new fromStore.AddActivityContent($event));
  }

  saveValues2() {
    const dd = {};
    this.store.dispatch(new fromStore.AddActivityContent(dd));
  }

  createFormLayout(schema) {
    // this.r(schema);
  }

  r(obj) {
    if (obj) {
      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          // console.log(key);
          if (key !== 'required') {
            this.r(obj[key]);
          }
        } else if (typeof obj[key] !== 'function') {
          // document.writeln(obj[key] + '<br/>');
          // console.log(key);
          // console.log(obj[key]);
        }
      }
    }

    return;
  }

  yourOnSubmitFn($event) {
    console.log($event);
  }

  showFormLayoutFn($event) {
    // console.log($event);
  }

  onSubmit() {
    console.log(this.model);
  }
}

export const MCQLayout = [
  'description',
  'question.question',
  { key: 'activity_id', readonly: true },
  {
    key: 'question.mcqchoice_set',
    items: [
      {
        items: [
          {
            key: 'question.mcqchoice_set[].choice_text',
            type: 'string',
            placeholder: 'Choice',
            default: 'yolo',
          },
          {
            key: 'question.mcqchoice_set[].explanation',
            placeholder: 'Explanation',
          },
          {
            key: 'question.mcqchoice_set[].is_correct',
          },
          {
            key: 'question.mcqchoice_set[].order',
          },
        ],
      },
    ],
  },
  { key: 'titlecomponent.title_image', type: 'emoji' },
  'question_seconds',
  'auto_next',
  'quiz_label',
  'next_activity_delay_seconds',
];

export const MCQData = {
  question: { mcqchoice_set: [{ choice_text: 'cell', explanation: '702-123-4567' }] },
};

export const formlyData = {
  schema: {
    title: 'A registration form',
    description: 'A simple form example.',
    type: 'object',
    required: ['firstName', 'lastName'],
    properties: {
      firstName: {
        type: 'string',
        title: 'First name',
        default: 'Chuck',
      },
      lastName: {
        type: 'string',
        title: 'Last name',
      },
      age: {
        type: 'integer',
        title: 'Age',
      },
      bio: {
        type: 'string',
        title: 'Bio',
      },
      password: {
        type: 'string',
        title: 'Password',
        minLength: 3,
      },
      telephone: {
        type: 'string',
        title: 'Telephone',
        minLength: 10,
      },
    },
  },
  model: {
    lastName: 'Norris',
    age: 75,
    bio: 'Roundhouse kicking asses since 1940',
    password: 'noneed',
  },
};

// propertiesToArray(obj) {
//   const isObject = (val) => typeof val === 'object' && !Array.isArray(val);

//   const addDelimiter = (a, b) => (a ? `${a}.${b}` : b);

//   const paths = (obj = {}, head = '') => {
//     return Object.entries(obj).reduce((product, [key, value]) => {
//       const fullPath = addDelimiter(head, key);
//       return isObject(value) ? product.concat(paths(value, fullPath)) : product.concat(fullPath);
//     }, []);
//   };

//   return paths(obj);
// }

// getQuestionsAJSF(fields, activity, content?): any {
//   const questions1: Array<QuestionSet> = [];
//   // console.log(fields, activity);
//   fields.forEach((field) => {
//     if (field.type === FieldTypes.string || field.type === FieldTypes.url) {
//       questions1.push({ fieldDetail: [this.getStringField(field,
// activity, content)], setType: 'control' });
//     } else if (field.type === FieldTypes.number) {
//       questions1.push({ fieldDetail: [this.getNumberField(field)], setType: 'control' });
//     } else if (field.type === FieldTypes.boolean) {
//       questions1.push({ fieldDetail: [this.getBooleanField(field)], setType: 'control' });
//     } else if (field.type === FieldTypes.emoji) {
//       // questions1.push(this.getEmojiField(field));
//     } else if (field.type === FieldTypes.object) {
//       const arrField = Object.keys(field.object_fields).map((id) => {
//         return { ...field.object_fields[id], id };
//       });
//       questions1.push({
//         key: field.id,
//         fieldDetail: this.getQuestions(arrField, activity, content),
//         setType: 'group',
//       });
//     } else if (field.type === FieldTypes.list) {
//       console.log(field);
//       const arrField = Object.keys(field.list_object_fields).map((id) => {
//         return { ...field.list_object_fields[id], id };
//       });
//       questions1.push({
//         key: field.id,
//         fieldDetail: this.getQuestions(arrField, activity, content),
//         setType: 'array',
//       });
//     }
//   });

//   const dropdown = new DropdownQuestion({
//     key: 'brave',
//     label: 'Bravery Rating',
//     options: [
//       { key: 'solid', value: 'Solid' },
//       { key: 'great', value: 'Great' },
//       { key: 'good', value: 'Good' },
//       { key: 'unproven', value: 'Unproven' },
//     ],
//     order: 3,
//   });

//   // console.log(questions1);
//   return questions1;
// }

// getQuestions(fields, activity, content?): any {
//   const questions1: Array<QuestionSet> = [];
//   // console.log(fields, activity);
//   fields.forEach((field) => {
//     if (field.type === FieldTypes.string || field.type === FieldTypes.url) {
//       questions1.push({ fieldDetail: [this.getStringField(field,
// activity, content)], setType: 'control' });
//     } else if (field.type === FieldTypes.number) {
//       questions1.push({ fieldDetail: [this.getNumberField(field)], setType: 'control' });
//     } else if (field.type === FieldTypes.boolean) {
//       questions1.push({ fieldDetail: [this.getBooleanField(field)], setType: 'control' });
//     } else if (field.type === FieldTypes.emoji) {
//       // questions1.push(this.getEmojiField(field));
//     } else if (field.type === FieldTypes.object) {
//       const arrField = Object.keys(field.object_fields).map((id) => {
//         return { ...field.object_fields[id], id };
//       });
//       questions1.push({
//         key: field.id,
//         fieldDetail: this.getQuestions(arrField, activity, content),
//         setType: 'group',
//       });
//     } else if (field.type === FieldTypes.list) {
//       console.log(field);
//       const arrField = Object.keys(field.list_object_fields).map((id) => {
//         return { ...field.list_object_fields[id], id };
//       });
//       questions1.push({
//         key: field.id,
//         fieldDetail: this.getQuestions(arrField, activity, content),
//         setType: 'array',
//       });
//     }
//   });

//   const dropdown = new DropdownQuestion({
//     key: 'brave',
//     label: 'Bravery Rating',
//     options: [
//       { key: 'solid', value: 'Solid' },
//       { key: 'great', value: 'Great' },
//       { key: 'good', value: 'Good' },
//       { key: 'unproven', value: 'Unproven' },
//     ],
//     order: 3,
//   });

//   // console.log(questions1);
//   return questions1;
// }

// getStringField(field, activity, content?): TextboxQuestion | EmojiQuestion {
//   if (field.id === 'activity_id') {
//     return new TextboxQuestion({
//       key: 'activity_id',
//       label: 'Activity ID',
//       value: activity.activity.id + '_' + activity.id,
//       readonly: true,
//       required: false,
//       order: 1,
//     });
//   } else if (field.id === 'description') {
//     return new TextboxQuestion({
//       key: 'description',
//       label: 'Description',
//       value: content ? content['description'] : '',
//       required: false,
//       order: 2,
//     });
//   } else if (field.id === 'title_emoji') {
//     return this.getEmojiField(field, activity, content);
//   } else {
//     return new TextboxQuestion({
//       key: field.id,
//       label: field.id,
//       value: content ? content[field.id] : '',
//       required: field.required,
//       order: 3,
//     });
//   }
// }

// getNumberField(field): TimeQuestion {
//   return new TimeQuestion({
//     key: field.id,
//     label: field.id,
//     type: 'number',
//     value: 0,
//     required: true,
//     order: 4,
//   });
// }

// getBooleanField(field): CheckboxQuestion {
//   if (field.id === 'auto_next') {
//     return new CheckboxQuestion({
//       key: field.id,
//       label: field.id,
//       value: true,
//       required: field.required,
//       order: 3,
//     });
//   } else if (field.id === 'hide_timer') {
//     return new CheckboxQuestion({
//       key: field.id,
//       label: field.id,
//       value: false,
//       required: field.required,
//       order: 3,
//     });
//   } else if (field.id === 'is_correct') {
//     return new CheckboxQuestion({
//       key: field.id,
//       label: field.id,
//       value: false,
//       required: field.required,
//       order: 3,
//     });
//   }
// }

// getEmojiField(field, activity, content?): EmojiQuestion {
//   return new EmojiQuestion({
//     key: field.id,
//     label: field.id,
//     value: content ? content[field.id] : '',
//     required: field.required,
//     order: 3,
//   });
// }

// getObjectFields(field, activity, content?): any {}

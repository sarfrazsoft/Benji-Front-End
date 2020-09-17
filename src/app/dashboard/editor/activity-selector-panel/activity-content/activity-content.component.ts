import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { FieldTypes } from '../../models/activity.model';
import * as fromStore from '../../store';
import { QuestionSet } from './services/question-control.service';

import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { cloneDeep, mapValues, reverse, sortBy } from 'lodash';
import { map } from 'rxjs/operators';

@Component({
  selector: 'benji-activity-content',
  templateUrl: './activity-content.component.html',
  styleUrls: ['./activity-content.component.scss'],
})
export class ActivityContentComponent implements OnInit {
  constructor(private store: Store<fromStore.EditorState>, private formlyJsonschema: FormlyJsonschema) {}
  activity$: Observable<any>;
  fields$: Observable<any>;
  content$: Observable<any>;
  fieldTypes = FieldTypes;
  questions$: Observable<Array<QuestionSet>>;
  showQuestions = false;

  form = new FormGroup({});
  model: any;
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];

  ngOnInit() {
    this.activity$ = this.store.select(fromStore.getSelectedLessonActivity);

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
          const act = pair.activity;
          const schema = cloneDeep(act.activity.schema);
          // internal_type = EmojiURLField indicates that the field is for emoji
          // map to intercept schema and make changes to fields
          // make activity_id readonly
          const fields = this.formlyJsonschema.toFieldConfig(schema as any, {
            map: (mappedField: FormlyFieldConfig, mapSource: any) => {
              if (mapSource.internal_type === 'EmojiURLField') {
                mappedField.type = 'emoji';
                mappedField.wrappers = ['form-field'];
                mappedField.templateOptions.label = 'Emoji';
              }
              if (mapSource.title === 'Activity ID') {
                mappedField.templateOptions.readonly = true;
              }
              console.log(mappedField);
              return mappedField;
            },
          });
          console.log(fields);
          const reversedOrder = cloneDeep(OrderArray);
          reverse(reversedOrder);
          fields.fieldGroup = fields.fieldGroup.sort((a, b) => {
            return reversedOrder.indexOf(b.key as string) - reversedOrder.indexOf(a.key as string);
          });

          fields.fieldGroup = fields.fieldGroup;
          this.fields = [fields];
          this.model = { activity_id: act.activity.displayName + '_' + act.id };
          this.showQuestions = true;
        }
      });
  }

  saveValues($event) {
    console.log($event);
  }

  onSubmit() {
    if (this.form.valid) {
      this.store.dispatch(new fromStore.AddActivityContent(this.model));
    }
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

export const FormlyData = {
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

export const TitleActivity = {
  schema: {
    title: 'Titleactivity',
    required: ['activity_id', 'main_title'],
    type: 'object',
    properties: {
      title_image: {
        title: 'Title image',
        type: 'string',
        minLength: 1,
        'x-nullable': true,
        intetnal_type: 'EmojiUrlField',
      },
      activity_id: {
        title: 'Activity ID',
        description: 'A unique name for this actihe same activity id.',
        type: 'string',
        maxLength: 60,
        minLength: 1,
      },
      description: {
        title: 'Description',
        description: 'A short description of the activity.',
        type: 'string',
        minLength: 1,
        'x-nullable': true,
      },
      next_activity_delay_seconds: {
        title: 'Next activity delay seconds',
        description: 'How many seconds to wait afteyou set auto_next to true.',
        type: 'integer',
        maximum: 1800,
        minimum: 0,
      },
      auto_next: {
        title: 'Auto next',
        description: 'Whether the oceed to the next activi their screen.',
        type: 'boolean',
      },
      main_title: { title: 'Main title', type: 'string', minLength: 1 },
      title_text: { title: 'Title text', type: 'string', minLength: 1, 'x-nullable': true },
      title_emoji: { title: 'Title emoji', type: 'string', maxLength: 20, minLength: 1, 'x-nullable': true },
      hide_timer: { title: 'Hide timer', type: 'boolean' },
    },
  },
};

export const OrderArray = ['activity_id', 'description', 'auto_next'];

export const Nested = {
  schema: {
    title: 'A list of tasks',
    type: 'object',
    required: ['title'],
    properties: {
      title: {
        type: 'string',
        title: 'Task list title',
      },
      tasks: {
        type: 'array',
        title: 'Tasks',
        items: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              title: 'Title',
              description: 'A sample title',
            },
            details: {
              type: 'string',
              title: 'Task details',
              description: 'Enter the task details',
            },
            done: {
              type: 'boolean',
              title: 'Done?',
              default: false,
            },
          },
        },
      },
    },
  },
  model: {},
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

import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class QuestionControlService {
  constructor() {}

  toFormGroup(questions: Array<QuestionSet>) {
    let group: any = {};
    console.log(questions);
    group = this.populateGroupObjRecursively(questions, group, 'group', 'gg');
    console.log(group);
    return group;
  }

  populateGroupObjRecursively(questions: Array<QuestionSet>, group, setType: string, key?: string) {
    console.log(questions);
    const group2 = {};
    const arr = [];

    questions.forEach((question: QuestionSet) => {
      if (question.setType === 'group') {
        group2[question.key] = this.populateGroupObjRecursively(
          question.fieldDetail,
          group2,
          question.setType,
          question.key
        );

        // question.fieldDetail.forEach((q) => {
        //   q = q.fieldDetail[0];
        //   childGroup[q.key] = this.getFormControl(q);
        // });
      } else if (question.setType === 'array') {
        const childGroup: any = [];
        // console.log(question);
        const r = this.populateGroupObjRecursively(question.fieldDetail, arr, 'array', question.key);
        // return { [question.key]: childGroup.push(d) };
        // form a new array from the current result and old result and return it
        // console.log(arr);
        // return new FormArray([d]);
        // return arr;
      } else if (question.setType === 'control') {
        const q = question.fieldDetail[0];
        group2[q.key] = this.getFormControl(q);
        return group2;
      } else {
        console.log('I should neve be called');
      }
    });
    if (setType === 'array') {
      const x = Object.keys(group2).map((id) => {
        return group2[id];
      });
      const y = {};
      y[key] = new FormArray(x);
      return y;
    } else {
      return new FormGroup(group2);
    }
  }

  getFormControl(q) {
    return q.required ? new FormControl(q.value, Validators.required) : new FormControl(q.value);
  }
}

export class QuestionBase<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  order: number;
  controlType: string;
  type: string;
  options: { key: string; value: string }[];

  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      disabled?: boolean;
      readonly?: boolean;
      order?: number;
      controlType?: string;
      type?: string;
      options?: { key: string; value: string }[];
    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.disabled = options.disabled;
    this.readonly = options.readonly;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
  }
}

export class TextboxQuestion extends QuestionBase<string> {
  controlType = 'textbox';
}

export class EmojiQuestion extends QuestionBase<string> {
  controlType = 'emoji';
  type = 'hidden';
}

export class TimeQuestion extends QuestionBase<number> {
  controlType = 'time';
}

export class DropdownQuestion extends QuestionBase<string> {
  controlType = 'dropdown';
}

export class CheckboxQuestion extends QuestionBase<boolean> {
  controlType = 'checkbox';
  type = 'checkbox';
}

export type QuestionType =
  | TextboxQuestion
  | EmojiQuestion
  | TimeQuestion
  | DropdownQuestion
  | CheckboxQuestion;

export interface QuestionSet {
  fieldDetail: any;
  key?: string;
  setType: 'group' | 'array' | 'control';
}

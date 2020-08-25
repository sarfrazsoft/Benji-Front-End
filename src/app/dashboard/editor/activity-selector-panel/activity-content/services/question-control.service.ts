import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class QuestionControlService {
  constructor() {}

  toFormGroup(questions: QuestionBase<string>[]) {
    const group: any = {};

    questions.forEach((question) => {
      group[question.key] = question.required
        ? new FormControl(question.value, Validators.required)
        : new FormControl(question.value);
    });
    return new FormGroup(group);
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

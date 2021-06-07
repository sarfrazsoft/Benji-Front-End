import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ng2-tooltip-directive';
import { TooltipOptions } from 'ng2-tooltip-directive';
import { SharedModule } from '../../shared/shared.module';
import { EditorRoutes } from './editor.routing';
import { EditorComponents, EditorEntryComponents, EditorProviders } from './index';

import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { effects, reducers } from './store';

import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ActivityHelpComponent } from './activity-selector-panel/activity-help/activity-help.component';
import {
  AccordionTypeComponent,
  ArrayTypeComponent,
  BAPBlankTypeComponent,
  CheckboxWrapperComponent,
  ConvoCardTypeComponent,
  EmojiSelectorComponent,
  FeedbackQuestionTypeComponent,
  FieldRevealWrapperComponent,
  FieldWrapperComponent,
  ImageSelectorComponent,
  MCQChoiceTypeComponent,
  MultiSchemaTypeComponent,
  NullTypeComponent,
  ObjectTypeComponent,
  PollChoiceTypeComponent,
  QuestionTypeSelectComponent,
  SecondsTypeComponent,
  LayoutPickerTypeComponent,
} from './services';

export function minItemsValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT have fewer than ${field.templateOptions.minItems} items`;
}

export function maxItemsValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT have more than ${field.templateOptions.maxItems} items`;
}

export function minlengthValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT be shorter than ${field.templateOptions.minLength} characters`;
}

export function maxlengthValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT be longer than ${field.templateOptions.maxLength} characters`;
}

export function minValidationMessage(err, field: FormlyFieldConfig) {
  return `should be >= ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field: FormlyFieldConfig) {
  return `should be <= ${field.templateOptions.max}`;
}

export function multipleOfValidationMessage(err, field: FormlyFieldConfig) {
  return `should be multiple of ${field.templateOptions.step}`;
}

export function exclusiveMinimumValidationMessage(err, field: FormlyFieldConfig) {
  return `should be > ${field.templateOptions.step}`;
}

export function exclusiveMaximumValidationMessage(err, field: FormlyFieldConfig) {
  return `should be < ${field.templateOptions.step}`;
}

export function constValidationMessage(err, field: FormlyFieldConfig) {
  return `should be equal to constant "${field.templateOptions.const}"`;
}

export const MyDefaultTooltipOptions: TooltipOptions = {
  'show-delay': 4000,
  'tooltip-class': 'benji-editor-tooltip',
};

@NgModule({
  imports: [
    CommonModule,
    EditorRoutes,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TooltipModule.forRoot(MyDefaultTooltipOptions as TooltipOptions),
    StoreModule.forFeature('editor', reducers),
    EffectsModule.forFeature(effects),
    FormlyModule.forRoot({
      extras: { lazyRender: true },
      validationMessages: [
        { name: 'required', message: 'This field is required' },
        { name: 'null', message: 'should be null' },
        { name: 'minlength', message: minlengthValidationMessage },
        { name: 'maxlength', message: maxlengthValidationMessage },
        { name: 'min', message: minValidationMessage },
        { name: 'max', message: maxValidationMessage },
        { name: 'multipleOf', message: multipleOfValidationMessage },
        { name: 'exclusiveMinimum', message: exclusiveMinimumValidationMessage },
        { name: 'exclusiveMaximum', message: exclusiveMaximumValidationMessage },
        { name: 'minItems', message: minItemsValidationMessage },
        { name: 'maxItems', message: maxItemsValidationMessage },
        { name: 'uniqueItems', message: 'should NOT have duplicate items' },
        { name: 'const', message: constValidationMessage },
      ],
      types: [
        { name: 'string', extends: 'input', wrappers: ['benji-field-wrapper'] },
        {
          name: 'number',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number',
            },
          },
          wrappers: ['benji-field-wrapper'],
        },
        {
          name: 'integer',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number',
            },
          },
          wrappers: ['benji-field-wrapper'],
        },
        { name: 'boolean', extends: 'checkbox', wrappers: ['benji-checkbox-wrapper'] },
        { name: 'enum', extends: 'select', wrappers: ['benji-field-wrapper'] },
        { name: 'null', component: NullTypeComponent, wrappers: ['benji-field-wrapper'] },
        { name: 'array', component: ArrayTypeComponent },
        { name: 'accordion', component: AccordionTypeComponent },
        { name: 'object', component: ObjectTypeComponent },
        { name: 'multischema', component: MultiSchemaTypeComponent, wrappers: ['benji-field-wrapper'] },
        { name: 'emoji', component: EmojiSelectorComponent, wrappers: ['benji-field-wrapper'] },
        { name: 'image', component: ImageSelectorComponent, wrappers: ['benji-field-wrapper'] },
        { name: 'mcqChoice', component: MCQChoiceTypeComponent },
        { name: 'pollChoice', component: PollChoiceTypeComponent },
        { name: 'bapBlank', component: BAPBlankTypeComponent },
        { name: 'feedbackQuestion', component: FeedbackQuestionTypeComponent },
        { name: 'questionTypeSelect', component: QuestionTypeSelectComponent },
        { name: 'convoCard', component: ConvoCardTypeComponent },
        { name: 'seconds', component: SecondsTypeComponent },
        { name: 'layoutPicker', component: LayoutPickerTypeComponent },
      ],
      wrappers: [
        { name: 'benji-field-wrapper', component: FieldWrapperComponent },
        { name: 'benji-checkbox-wrapper', component: CheckboxWrapperComponent },
        { name: 'benji-reveal-field-wrapper', component: FieldRevealWrapperComponent },
      ],
    }),
    FormlyBootstrapModule,
  ],
  exports: [RouterModule],
  declarations: [EditorComponents, ActivityHelpComponent],
  entryComponents: EditorEntryComponents,
  providers: EditorProviders,
})
export class EditorModule {}

export function EditorEntrypoint() {
  return EditorModule;
}

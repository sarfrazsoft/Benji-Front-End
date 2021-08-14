import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'benji-feedback-question-type',
  templateUrl: './feedback-question.type.html',
})
export class FeedbackQuestionTypeComponent extends FieldType implements OnInit {
  questionTextField: FormlyFieldConfig;
  isComboField: FormlyFieldConfig;
  typeField: FormlyFieldConfig;
  comboTextField: FormlyFieldConfig;

  ngOnInit() {
    this.field.fieldGroup.forEach((val, i) => {
      if (val.key === 'question_text') {
        this.questionTextField = val;
        this.questionTextField.templateOptions.label = null;
      } else if (val.key === 'is_combo') {
        val.templateOptions.label = '';
        val.hide = true;
        this.isComboField = val;
      } else if (val.key === 'combo_text') {
        val.hide = true;
        this.comboTextField = val;
      } else if (val.key === 'question_type') {
        val.templateOptions.options = [
          // {
          //   value: 'rating_agreedisagree',
          //   label: '<mat-icon>home</mat-icon> Rating',
          // },
          // { value: 'text_only', label: '<mat-icon>format_align_left</mat-icon> Open Textx' },
          // { value: 'scale',
          //   label: '<mat-icon>poll</mat-icon> Scale'
          // },
          // { value: 'multiple_choice',
          //   label: '<mat-icon>check</mat-icon> Multiple Choice'
          // },
        ];
        console.log(val);
        this.typeField = val;
        this.typeField.templateOptions.label = null;
        this.typeField.templateOptions.required = false;
        this.typeField.type = 'questionTypeSelect';
      }
    });
  }
}

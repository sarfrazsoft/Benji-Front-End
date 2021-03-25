import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'benji-convo-card-type',
  templateUrl: './convo-card.type.html',
})
export class ConvoCardTypeComponent extends FieldType implements OnInit {
  questionTextField: FormlyFieldConfig;
  textFieldValue = '';
  isComboField: FormlyFieldConfig;
  typeField: FormlyFieldConfig;
  comboTextField: FormlyFieldConfig;

  ngOnInit() {
    this.field.fieldGroup.forEach((val, i) => {
      if (val.key === 'main_title') {
        this.questionTextField = val;
        if (this.questionTextField.formControl) {
          this.textFieldValue = this.questionTextField.formControl.value;
        }
        this.questionTextField.templateOptions.label = null;
      } else if (val.key === 'title_text') {
        val.templateOptions.label = '';
        val.hide = false;
      } else if (val.key === 'title_image') {
        val.hide = false;
        val.type = 'emoji';
        // this.comboTextField = val;
      } else if (val.key === 'question_type') {
        val.templateOptions.options = [
          {
            value: 'rating_agreedisagree',
            label: '<mat-icon aria-hidden="false" aria-label="Example home icon">home</mat-icon> Rating',
          },
          { value: 'text_only', label: '<mat-icon>format_align_left</mat-icon> Open Text' },
        ];
        this.typeField = val;
        this.typeField.templateOptions.label = null;
        this.typeField.templateOptions.required = false;
        this.typeField.type = 'questionTypeSelect';
      }
    });
  }

  getTextFieldValue() {
    if (this.questionTextField && this.questionTextField.formControl) {
      return this.questionTextField.formControl.value;
    }
  }
}

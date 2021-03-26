import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'benji-convo-card-type',
  templateUrl: './convo-card.type.html',
})
export class ConvoCardTypeComponent extends FieldType implements OnInit {
  cardImageField: FormlyFieldConfig;
  cardTitleField: FormlyFieldConfig;
  textFieldValue = '';
  cardTextField: FormlyFieldConfig;
  typeField: FormlyFieldConfig;

  ngOnInit() {
    this.field.fieldGroup.forEach((val, i) => {
      if (val.key === 'card_image') {
        val.hide = false;
        val.type = 'emoji';
        this.cardImageField = val;
      } else if (val.key === 'card_title') {
        this.cardTitleField = val;
        if (this.cardTitleField.formControl) {
          this.textFieldValue = this.cardTitleField.formControl.value;
        }
        this.cardTitleField.templateOptions.label = 'Title';
      } else if (val.key === 'card_text') {
        val.hide = false;
        val.templateOptions.label = 'Text';
        this.cardTextField = val;
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
    if (this.cardTitleField && this.cardTitleField.formControl) {
      return this.cardTitleField.formControl.value;
    }
  }
}

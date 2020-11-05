import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'benji-bap-blank-type',
  templateUrl: './bap-blank.type.html',
})
export class BAPBlankTypeComponent extends FieldType implements OnInit {
  label: FormlyFieldConfig;
  blank: FormlyFieldConfig;
  orderField: FormlyFieldConfig;
  explanationField: FormlyFieldConfig;

  ngOnInit() {
    this.field.fieldGroup.forEach((val, i) => {
      if (val.key === 'label') {
        this.label = val;
        this.label.templateOptions.label = null;
        this.label.templateOptions.placeholder = 'Label';
      } else if (val.key === 'temp_text') {
        val.templateOptions.label = '';
        this.blank = val;
        this.blank.templateOptions.placeholder = 'Blank';
      } else if (val.key === 'order') {
        // forgetting about order for now
        val.hide = true;
        this.orderField = val;
      } else if (val.key === 'help_text') {
        this.explanationField = val;
        this.explanationField.templateOptions.label = null;
        if (this.explanationField.model && this.explanationField.model.explanation) {
          val.hide = false;
          this.explanationField.hide = false;
        } else {
          val.hide = true;
          this.explanationField.hide = true;
        }
      }
    });
  }

  revealExplanation() {
    this.explanationField.hide = false;
  }
}

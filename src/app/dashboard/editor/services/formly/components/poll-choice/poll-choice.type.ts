import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'benji-poll-choice-type',
  templateUrl: './poll-choice.type.html',
})
export class PollChoiceTypeComponent extends FieldType implements OnInit {
  choiceTextField: FormlyFieldConfig;
  isCorrectField: FormlyFieldConfig;
  orderField: FormlyFieldConfig;
  explanationField: FormlyFieldConfig;

  @Output() someEvent = new EventEmitter<string>();

  ngOnInit() {
    this.field.fieldGroup.forEach((val, i) => {
      if (val.key === 'choice_text') {
        this.choiceTextField = val;
        this.choiceTextField.templateOptions.label = null;
        this.choiceTextField.templateOptions.keydown = (field, event: KeyboardEvent) => {
          if (event.key === 'Enter') {
            event.stopPropagation();
            event.preventDefault();
          }
        };
      } else if (val.key === 'is_correct') {
        val.templateOptions.label = '';
        this.isCorrectField = val;
      } else if (val.key === 'order') {
        // forgetting about order for now
        val.hide = true;
        this.orderField = val;
      } else if (val.key === 'explanation') {
        this.explanationField = val;
        this.explanationField.templateOptions.label = null;
        if (this.explanationField.model.explanation) {
          this.explanationField.hide = false;
        } else {
          this.explanationField.hide = true;
        }
      }
    });
  }

  revealExplanation() {
    this.explanationField.hide = false;
  }
}

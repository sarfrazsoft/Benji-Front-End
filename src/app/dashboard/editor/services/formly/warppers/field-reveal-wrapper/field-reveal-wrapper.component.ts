import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'benji-reveal-field-wrapper',
  templateUrl: './field-reveal-wrapper.component.html',
  styleUrls: ['./field-reveal-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRevealWrapperComponent extends FieldWrapper implements OnInit {
  showField = false;
  ngOnInit() {
    // console.log(this.field);
    if (
      this.field.model['' + this.field.key] === this.field.defaultValue ||
      this.field.model['' + this.field.key] === undefined
    ) {
    } else {
      this.showField = true;
    }

    // if model is an array for example a list of categories
    if (Array.isArray(this.field.model)) {
      this.field.model.length ? (this.showField = true) : (this.showField = false);
    }
  }

  revealField(reveal: boolean) {
    this.showField = reveal;
    if (reveal) {
    } else {
      if (Array.isArray(this.field.model)) {
        this.field.formControl.reset();
      } else {
        if (this.field.defaultValue !== undefined) {
          this.field.formControl.setValue(this.field.defaultValue);
        }
      }
      // if the model is an array for example a list of categories
      // if (Array.isArray(this.field.model)) {
      //   this.field.formControl.setValue([]);
      // }
    }
  }
}

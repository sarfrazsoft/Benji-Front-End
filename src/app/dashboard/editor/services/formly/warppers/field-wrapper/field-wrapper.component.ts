import { ChangeDetectionStrategy, Component, OnChanges, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'benji-field-wrapper',
  templateUrl: './field-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldWrapperComponent extends FieldWrapper implements OnInit, OnChanges {
  characterLimitLeft;
  ngOnInit() {
    if (this.to.maxLength && this.field.formControl.value) {
      this.characterLimitLeft = this.to.maxLength - this.field.formControl.value.length;
    }
    this.field.formControl.valueChanges.subscribe((val) => {
      if (this.field.formControl.value) {
        this.characterLimitLeft = this.to.maxLength - this.field.formControl.value.length;
      }
    });
  }

  ngOnChanges() {}
}

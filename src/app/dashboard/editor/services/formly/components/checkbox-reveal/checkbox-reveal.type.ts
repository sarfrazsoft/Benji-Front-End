import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'benji-checkbox-reveal-type',
  templateUrl: './checkbox-reveal.type.html',
})
export class CheckboxRevealTypeComponent extends FieldType implements OnInit {
  formField: FormlyFieldConfig;
  ngOnInit() {
    console.log(this.field);
    this.field.type = this.field['originalType'];

    if (this.field.key === 'description') {
      this.field.hide = true;
    }
    // this.field.hide = true;

    this.formField = this.field;
    // setTimeout(() => {
    //   // this will make the execution after the above boolean has changed
    //   // this.searchElement.nativeElement.focus();
    //   // this.searchElement.nativeElement.focus();
    //   this.formField.hide = true;
    // }, 3);
  }

  revealField(value: boolean) {
    console.log(value);
    this.formField.hide = false;
  }
}

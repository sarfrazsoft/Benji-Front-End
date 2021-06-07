import { Component, Input, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'benji-layout-picker-type',
  templateUrl: './layout-picker.type.html',
  styleUrls: [ './layout-picker.type.scss' ]
})
export class LayoutPickerTypeComponent extends FieldType implements OnInit {
  chosen: string = "icon-center";

  ngOnInit() {
    if (this.formControl.value) {
      this.chosen = this.formControl.value;
    }
  }

  public layoutClicked(choice : string){
    this.chosen = choice;
    this.formControl.setValue(this.chosen);
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Observable } from 'rxjs/Observable';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'benji-layout-picker-type',
  templateUrl: './layout-picker.type.html',
  styleUrls: [ './layout-picker.type.scss' ]
})
export class LayoutPickerTypeComponent extends FieldType implements OnInit {
    layouts$: Observable<any[]>;
    selected: boolean = false;


  ngOnInit() {
  }
}

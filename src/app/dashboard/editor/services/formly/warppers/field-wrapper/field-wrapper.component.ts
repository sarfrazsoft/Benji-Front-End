import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'benji-field-wrapper',
  templateUrl: './field-wrapper.component.html',
  styleUrls: ['./field-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldWrapperComponent extends FieldWrapper {}

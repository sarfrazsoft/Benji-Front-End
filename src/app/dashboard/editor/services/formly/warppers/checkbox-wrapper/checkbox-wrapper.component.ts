import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
@Component({
  selector: 'benji-checkbox-wrapper',
  templateUrl: './checkbox-wrapper.component.html',
  styleUrls: ['./checkbox-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxWrapperComponent extends FieldWrapper {}

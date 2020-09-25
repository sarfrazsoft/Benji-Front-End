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
    console.log(this.field);
  }

  revealField(value: boolean) {
    this.showField = value;
  }
}

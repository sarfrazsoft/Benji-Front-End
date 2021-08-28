import { ChangeDetectionStrategy, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { SelectControlValueAccessor } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'benji-formly-rating-type',
  templateUrl: './rating-type.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingTypeComponent extends FieldType implements OnInit {
  ngOnInit() {
    // console.log(this.to);
  }

  constructor(private ngZone: NgZone) {
    super();
  }
}

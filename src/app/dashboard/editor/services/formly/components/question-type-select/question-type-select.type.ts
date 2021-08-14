import { ChangeDetectionStrategy, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { SelectControlValueAccessor } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'benji-formly-field-select',
  templateUrl: './question-type-select.type.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionTypeSelectComponent extends FieldType implements OnInit {
  defaultOptions = {
    templateOptions: {
      options: [],
      compareWith(o1: any, o2: any) {
        return o1 === o2;
      },
    },
  };

  ngOnInit() {
    this.to['compareWith'] = (o1: any, o2: any) => {
      return o1 === o2;
    };
    console.log(this.to);
  }

  // workaround for https://github.com/angular/angular/issues/10010
  @ViewChild(SelectControlValueAccessor, { static: true }) set selectAccessor(s: any) {
    if (!s) {
      return;
    }

    const writeValue = s.writeValue.bind(s);
    if (s._getOptionId(s.value) === null) {
      writeValue(s.value);
    }

    s.writeValue = (value: any) => {
      const id = s._idCounter;
      writeValue(value);
      if (value === null) {
        this.ngZone.onStable
          .asObservable()
          .pipe(take(1))
          .subscribe(() => {
            if (
              id !== s._idCounter &&
              s._getOptionId(value) === null &&
              s._elementRef.nativeElement.selectedIndex !== -1
            ) {
              writeValue(value);
            }
          });
      }
    };
  }

  constructor(private ngZone: NgZone) {
    super();
  }
}

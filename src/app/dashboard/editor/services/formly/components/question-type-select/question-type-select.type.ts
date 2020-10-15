import { ChangeDetectionStrategy, Component, NgZone, ViewChild } from '@angular/core';
import { SelectControlValueAccessor } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'benji-formly-field-select',
  template: `
    <select
      *ngIf="to.multiple; else singleSelect"
      class="form-control"
      multiple
      [class.custom-select]="to.customSelect"
      [formControl]="formControl"
      [compareWith]="to.compareWith"
      [class.is-invalid]="showError"
      [formlyAttributes]="field"
    >
      <ng-container *ngIf="to.options | formlySelectOptions: field | async as opts">
        <ng-container *ngIf="to._flatOptions; else grouplist">
          <ng-container *ngFor="let opt of opts">
            <option [ngValue]="opt.value" [disabled]="opt.disabled">{{ opt.label }}</option>
          </ng-container>
        </ng-container>
        <ng-template #grouplist>
          <ng-container *ngFor="let opt of opts">
            <option *ngIf="!opt.group; else optgroup" [ngValue]="opt.value" [disabled]="opt.disabled">
              {{ opt.label }}
            </option>
            <ng-template #optgroup>
              <optgroup [label]="opt.label">
                <option *ngFor="let child of opt.group" [ngValue]="child.value" [disabled]="child.disabled">
                  {{ child.label }}
                </option>
              </optgroup>
            </ng-template>
          </ng-container>
        </ng-template>
      </ng-container>
    </select>
    <ng-template #singleSelect>
      <mat-select
        placeholder="Type"
        class="form-control"
        [formControl]="formControl"
        [compareWith]="to.compareWith"
        [class.custom-select]="to.customSelect"
        [class.is-invalid]="showError"
        [formlyAttributes]="field"
      >
        <mat-select-trigger>
          <mat-icon *ngIf="formControl.value === 'rating_agreedisagree'">star</mat-icon>
          <mat-icon *ngIf="formControl.value === 'text_only'">format_align_left</mat-icon>
        </mat-select-trigger>
        <ng-container *ngIf="to.options | formlySelectOptions: field | async as opts">
          <ng-container *ngIf="to._flatOptions; else grouplist">
            <ng-container>
              <mat-option [value]="'rating_agreedisagree'"> <mat-icon>star</mat-icon> Rating </mat-option>
              <mat-option [value]="'text_only'">
                <mat-icon>format_align_left</mat-icon> Open Text
              </mat-option>
            </ng-container>
          </ng-container>
          <ng-template #grouplist>
            <ng-container *ngFor="let opt of opts">
              <option *ngIf="!opt.group; else optgroup" [ngValue]="opt.value" [disabled]="opt.disabled">
                {{ opt.label }}
              </option>
              <ng-template #optgroup>
                <optgroup [label]="opt.label">
                  <option *ngFor="let child of opt.group" [ngValue]="child.value" [disabled]="child.disabled">
                    {{ child.label }}
                  </option>
                </optgroup>
              </ng-template>
            </ng-container>
          </ng-template>
        </ng-container>
      </mat-select>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionTypeSelectComponent extends FieldType {
  defaultOptions = {
    templateOptions: {
      options: [],
      compareWith(o1: any, o2: any) {
        return o1 === o2;
      },
    },
  };

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

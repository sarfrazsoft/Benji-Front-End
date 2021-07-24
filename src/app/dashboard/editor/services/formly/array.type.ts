import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'formly-array-type',
  template: `
    <div class="mb-3" (keypress)="keypress($event)">
      <legend *ngIf="to.label && !to.hideArrayLabel">{{ to.label }}</legend>
      <p *ngIf="to.description">{{ to.description }}</p>

      <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>

      <div *ngFor="let field of field.fieldGroup; let i = index" class="" fxLayout="row">
        <formly-field class="" [field]="field" fxFlex="100"></formly-field>
        <div class="remove-button text-right">
          <button class="" (click)="remove(i)" (keypress)="$event.stopPropagation()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <div class="d-flex">
        <button class="editor-content-button add-answer" type="button" (click)="add()">
          <ng-container *ngIf="to.addLabel">
            {{ to.addLabel }}
          </ng-container>
          <ng-container *ngIf="!to.addLabel"> Add {{ to.label }} </ng-container>
        </button>
      </div>
    </div>
  `,
})
export class ArrayTypeComponent extends FieldArrayType {
  // TODO: add explicit constructor
  keypress(event) {
    if (event.key === 'Enter') {
      this.add();
    }
  }
}

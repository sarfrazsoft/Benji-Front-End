import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appActivity]',
})
export class ActivityDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

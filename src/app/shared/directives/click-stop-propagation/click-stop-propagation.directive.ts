import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[benji-click-stop-propagation]',
})
export class ClickStopPropagationDirective {
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }
}

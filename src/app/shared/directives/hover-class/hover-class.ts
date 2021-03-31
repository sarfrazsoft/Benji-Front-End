import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[benji-hover-class]',
})
export class HoverClassDirective {
  constructor(public elementRef: ElementRef) {}
  @Input('benji-hover-class') hoverClass: any;

  @HostListener('mouseenter') onMouseEnter() {
    console.log(this.hoverClass);
    const classes = this.hoverClass.split(' ');
    for (let i = 0; i < classes.length; i++) {
      this.elementRef.nativeElement.classList.add(classes[i]);
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    const classes = this.hoverClass.split(' ');
    for (let i = 0; i < classes.length; i++) {
      this.elementRef.nativeElement.classList.remove(classes[i]);
    }
  }
}

import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[benji-prevent-drag-click]',
})
export class PreventDragClickDirective {
  subscription = new Subscription();
  @Input('clickEvent') clickEvent;
  stopClick;

  @HostListener('click', ['$event, $event.target'])
  onClick(event, targetElement) {
    console.log(targetElement);
    if (this.stopClick) {
      event.stopPropagation();
      event.preventDefault();
      event.cancelBuble = true;
      event.stopImmediatePropagation();
      console.log('click event stopped');
    } else {
      this.clickEvent();
    }
  }

  @HostListener('mousedown', ['$event, $event.target'])
  onMouseDown(event, targetElement) {
    console.log(targetElement);
    // console.log(this.isAuth, typeof this.isAuth);
    // if (!this.isAuth) {
    //   event.stopPropagation();
    //   event.preventDefault();
    //   event.cancelBuble = true;
    //   event.stopImmediatePropagation();
    //   console.log('click event stopped');
    // } else {
    //   this.clickEvent();
    // }
  }

  @HostListener('mouseup', ['$event, $event.target'])
  onMouseUp(event, targetElement) {
    // console.log(targetElement);
    // console.log(this.isAuth, typeof this.isAuth);
    // if (!this.isAuth) {
    //   event.stopPropagation();
    //   event.preventDefault();
    //   event.cancelBuble = true;
    //   event.stopImmediatePropagation();
    //   console.log('click event stopped');
    // } else {
    //   this.clickEvent();
    // }
  }
}

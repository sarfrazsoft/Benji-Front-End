import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

declare var twemoji: any;

@Component({
  selector: 'app-b-twemoji2',
  template: ''
})
export class BTwemoji2Component implements OnInit {
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  @Input() emoji: string;

  ngOnInit() {
    // return;
    const hostDiv = this.renderer.createElement('div');
    const text = this.renderer.createText(this.emoji);
    this.renderer.appendChild(hostDiv, text);
    this.renderer.appendChild(this.el.nativeElement, hostDiv);
    // console.log(hostDiv);

    twemoji.parse(this.el.nativeElement, {
      ext: '.svg',
      folder: 'svg'
    });
  }
}

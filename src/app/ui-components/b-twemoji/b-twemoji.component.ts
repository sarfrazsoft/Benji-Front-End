import { Component, OnInit, Renderer2, ElementRef, Input } from '@angular/core';

declare var twemoji: any;


@Component({
  selector: 'app-b-twemoji',
  templateUrl: './b-twemoji.component.html',
  styleUrls: ['./b-twemoji.component.scss']
})
export class BTwemojiComponent implements OnInit {
  constructor(private renderer: Renderer2, private el: ElementRef) { }

  @Input() emoji: string;

  ngOnInit() {

    const hostDiv = this.renderer.createElement('div');
    const text = this.renderer.createText(this.emoji);
    this.renderer.appendChild(hostDiv, text);
    this.renderer.appendChild(this.el.nativeElement, hostDiv);
    console.log(hostDiv);

    twemoji.parse(this.el.nativeElement, {
      ext: '.svg',
      folder: 'svg'
    });

  }

}

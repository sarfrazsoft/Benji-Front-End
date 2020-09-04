import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { EmojiLookupService } from 'src/app/services';

// declare var twemoji: any;
declare var twemoji: {
  convert: {
    fromCodePoint(hexCodePoint: string): string;
    toCodePoint(utf16surrogatePairs: string): string;
  };
  parse(node: HTMLElement | string, options?: TwemojiOptions): void;
};
interface TwemojiOptions {
  /**
   * Default: MaxCDN
   */
  base?: string;
  /**
   * Default: .png
   */
  ext?: string;
  /**
   * Default: emoji
   */
  className?: string;
  /**
   * Default: 72x72
   */
  size?: string | number;
  /**
   * To render with SVG use `folder: svg, ext: .svg`
   */
  folder?: string;
  /**
   * The function to invoke in order to generate image src(s).
   */
  callback?(icon: string, options: TwemojiOptions): void;
  /**
   * Default () => ({})
   */
  attributes?(): void;
}

@Component({
  selector: 'app-b-twemoji',
  templateUrl: './b-twemoji.component.html',
  styleUrls: ['./b-twemoji.component.scss'],
})
export class BTwemojiComponent implements OnInit {
  // emoji will have three types of input
  // 1- emoji
  // 2- unicode
  // 3- text (legacy-lessons)
  // example usage is:
  // <app-b-twemoji class="body-emoji" [emojiUnicode]="'1F44B'"></app-b-twemoji>
  // <app-b-twemoji class="body-emoji" emoji="👋"></app-b-twemoji>
  // <app-b-twemoji [text]="'emoji://speech'"></app-b-twemoji>
  @Input() emojiUnicode;
  @Input() emoji;
  @Input() text;
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private emojiLookupService: EmojiLookupService
  ) {}

  ngOnInit() {
    if (this.emojiUnicode) {
    } else if (this.emoji) {
      this.setupEmoji(this.emoji);
    } else if (this.text) {
      // if text is a legacy emoji
      console.log(/^[a-b]/.test(this.text));
      console.log(this.text);
      // const e = this.text.split('//')[1];
      if (this.text.includes('//')) {
        const x = this.emojiLookupService.getEmoji(this.text);
        this.setupEmoji(x);
      } else {
        // the text is a unicode for example
        // '1F468-200D-1F469-200D-1F466' or '1F468'
        if (this.text.includes('-')) {
          const arr = this.text.split('-');
          let ee = '';
          arr.forEach((code) => {
            ee = ee + twemoji.convert.fromCodePoint(code);
          });
          this.setupEmoji(ee);
        } else {
          const x = twemoji.convert.fromCodePoint(this.text);
          this.setupEmoji(x);
        }
      }
    }
  }

  setupEmoji(e) {
    console.log(e);
    const hostDiv = this.renderer.createElement('div');
    const text = this.renderer.createText(e);
    this.renderer.appendChild(hostDiv, text);
    this.renderer.appendChild(this.el.nativeElement, hostDiv);
    twemoji.parse(this.el.nativeElement, {
      ext: '.svg',
      folder: 'svg',
    });
  }
}

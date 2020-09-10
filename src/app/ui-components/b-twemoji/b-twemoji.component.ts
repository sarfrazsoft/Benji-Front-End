import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';
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
export class BTwemojiComponent implements OnInit, OnChanges {
  // emoji will have 2 types of input
  // 1- emoji
  // 2- text
  // example usage is:
  // <app-b-twemoji class="body-emoji" emoji="👋"></app-b-twemoji>
  // <app-b-twemoji [text]="'emoji://speech'"></app-b-twemoji>
  // <app-b-twemoji [text]="'emoji://1F468-200D-1F469-200D-1F466'"></app-b-twemoji>
  // <app-b-twemoji [text]="'emoji://1F468'"></app-b-twemoji>
  @Input() emoji;
  @Input() text;
  hostDiv;
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private emojiLookupService: EmojiLookupService
  ) {}

  ngOnInit() {
    this.updateEmoji();
  }

  ngOnChanges() {
    this.updateEmoji();
  }

  updateEmoji() {
    if (this.emoji) {
      this.setupEmoji(this.emoji);
    } else if (this.text) {
      // if text is a legacy emoji
      const emojiText = this.text.split('//')[1];
      if (/^[a-b]/.test(emojiText)) {
        const x = this.emojiLookupService.getEmoji(this.text);
        this.setupEmoji(x);
      } else {
        // the text is a unicode for example
        // '1F468-200D-1F469-200D-1F466' or '1F468'
        if (emojiText.includes('-')) {
          const arr = emojiText.split('-');
          let e = '';
          arr.forEach((code) => {
            e = e + twemoji.convert.fromCodePoint(code);
          });
          this.setupEmoji(e);
        } else {
          const x = twemoji.convert.fromCodePoint(emojiText);
          this.setupEmoji(x);
        }
      }
    }
  }

  setupEmoji(e) {
    if (!this.hostDiv) {
      this.hostDiv = this.renderer.createElement('div');
    } else {
      this.renderer.removeChild(this.el.nativeElement, this.hostDiv);
      this.hostDiv = this.renderer.createElement('div');
    }
    const text = this.renderer.createText(e);
    this.renderer.appendChild(this.hostDiv, text);
    this.renderer.appendChild(this.el.nativeElement, this.hostDiv);
    twemoji.parse(this.el.nativeElement, {
      ext: '.svg',
      folder: 'svg',
    });
  }
}

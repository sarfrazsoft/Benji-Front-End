import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Editor } from '@tiptap/core';
import { BubbleMenuPlugin, BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'benji-bubble-menu[editor], [tiptapBubbleMenu][editor]',
})
export class BubbleMenuDirective implements OnInit, OnDestroy {
  @Input() pluginKey: BubbleMenuPluginProps['pluginKey'] = 'NgxTiptapBubbleMenu';
  @Input() editor!: Editor;
  @Input() tippyOptions: BubbleMenuPluginProps['tippyOptions'] = {};

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    if (!this.editor) {
      throw new Error('Required: Input `editor`');
    }

    this.editor.registerPlugin(
      BubbleMenuPlugin({
        pluginKey: this.pluginKey,
        editor: this.editor,
        element: this.elRef.nativeElement,
        tippyOptions: this.tippyOptions,
        shouldShow: ({ editor, view, state, oldState, from, to }): boolean => {
          if (editor.isActive('heading') || from === to) {
            return false;
          } else if (editor.isActive('angularImageComponent') || editor.isActive('image')) {
            return false;
          }
          return true;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.editor.unregisterPlugin(this.pluginKey);
  }
}

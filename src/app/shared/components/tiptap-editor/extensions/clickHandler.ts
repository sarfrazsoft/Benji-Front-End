import { Editor, Extension, getAttributes } from '@tiptap/core';
import { MarkType } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';

interface ClickHandlerOptions {
  lessonRunCode: string;
  navigateToBoard: any;
}

export const createClickHandler = (options: ClickHandlerOptions) => {
  const extension = Extension.create({
    name: 'eventHandler',
    priority: 10000,

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('eventHandler'),
          props: {
            handleClick(view, pos, event) {
              if (view.editable) {
                const attrs = getAttributes(view.state, 'link');
                const link = (event.target as HTMLElement)?.closest('a');

                // console.log(link, attrs);
                if (link && attrs.href) {
                  if (
                    attrs.href.includes('/screen/lesson/') &&
                    attrs.href.includes('board=') &&
                    attrs.href.includes(options.lessonRunCode)
                  ) {
                    const href = attrs.href;
                    const startIndex = href.indexOf('board=') + 6;
                    const endIndex = href.includes('post=') ? href.indexOf('&post=') : href.length - 1;
                    const board = href.slice(startIndex, endIndex + 1);
                    options.navigateToBoard(board);
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                  } else {
                    window.open(attrs.href, attrs.target);
                    return true;
                  }
                }
              }

              return false;
              // return true;
            },
            // handleDoubleClick(view, pos, event) {
            //   /* … */
            // },
            // handlePaste(view, event, slice) {
            //   /* … */
            // },
            // … and many, many more.
            // Here is the full list: https://prosemirror.net/docs/ref/#view.EditorProps
          },
        }),
      ];
    },
  });

  return extension;
};

import { Injector } from '@angular/core';
import { Node, NodeViewProps } from '@tiptap/core';
import { Mention, MentionOptions } from '@tiptap/extension-mention';
import { AngularRenderer } from 'ngx-tiptap';
import tippy from 'tippy.js';
import defaultCommands from './defaultCommands';
import { MentionsListComponent } from './mentions.component';

export function GetSlashMenuExtension(injector: Injector): Node<MentionOptions, any> {
  return Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    suggestion: {
      allowSpaces: false,
      char: '/',
      items: ({ editor, query }) => {
        const commands = [
          {
            title: 'MEDIA',
            childCommands: defaultCommands[0],
          },
          {
            title: 'TEXT & LAYOUT',
            childCommands: defaultCommands[1],
          },
        ];
        for (let i = 0; i < commands.length; i++) {
          commands[i].childCommands.filter((cmd) => cmd.match(query));
        }
        return commands;
      },
      render: () => {
        let renderer: AngularRenderer<MentionsListComponent, NodeViewProps>;
        let popup;

        return {
          onStart: (props) => {
            renderer = new AngularRenderer(MentionsListComponent, injector, props);
            renderer.instance.props = props;
            renderer.instance.editor = props.editor;
            renderer.instance.search.next(props.text);
            renderer.instance.itemSelected.subscribe((val) => {
              val.execute(props.editor, props.range);
            });

            popup = tippy('body', {
              getReferenceClientRect: props.clientRect,
              appendTo: () => document.body,
              content: renderer.dom,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'bottom-start',
            });
          },
          onUpdate(props) {
            renderer.instance.props = props;
            renderer.instance.search.next(props.text);

            popup[0].setProps({
              getReferenceClientRect: props.clientRect,
            });
          },
          onKeyDown(props) {
            if (props.event.key === 'Escape') {
              popup[0].hide();

              return true;
            }
            return renderer.instance.onKeyDown(props);
          },
          onExit() {
            popup[0].destroy();
            renderer.destroy();
          },
        };
      },
    },
  });
}
function getMediaCommands() {}

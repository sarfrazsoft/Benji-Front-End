import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Editor } from '@tiptap/core';
import { findParentNode } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import { Image } from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { Underline } from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import {
  CounterComponentExtension,
  EditableComponentExtension,
  IframeComponentExtension,
  ImageComponentExtension,
} from './extensions/extensions';
import { GetSlashMenuExtension } from './extensions/mentions/slash-menu-extension';
import { GetPlaceholderExtension } from './extensions/placeholder';

export const findBlock = findParentNode((node) => node.type.name === 'block');

const CustomDocument = Document.extend({
  content: 'heading block*',
});

@Component({
  selector: 'benji-tiptap-editor',
  templateUrl: './tiptap-editor.component.html',
})
export class TiptapEditorComponent implements OnInit, OnChanges {
  @Input() defaultValue;
  @Input() lessonRunCode;
  @Input() editable = true;
  @Input() benjiPages = false;
  @Output() textChanged = new EventEmitter<string>();

  editorContent;
  editor;

  tippyOptionsBubble = {
    duration: [100, 250],
  };

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.editor = new Editor({
      extensions: this.getEditorExtensions(),
      editorProps: {
        attributes: {
          class: 'prose prose-sm focus:outline-none',
          lessonRunCode: this.lessonRunCode,
        },
      },
      onUpdate: (update: { editor: Editor; transaction: any }) => {
        if (!update.editor.getText()) {
          this.textChanged.emit('');
        } else {
          this.textChanged.emit(this.defaultValue);
        }
      },
    });
    this.editor.setEditable(this.editable);
  }
  ngOnChanges() {}

  getEditorExtensions(): any {
    const defaultExtensions = [
      Underline,
      Link.configure({
        HTMLAttributes: {
          class: 'benji-link-class',
        },
        openOnClick: false,
      }),
    ];
    if (this.benjiPages) {
      return [
        ...defaultExtensions,
        CustomDocument,
        TaskList,
        Image,
        TaskItem.configure({
          nested: true,
        }),
        StarterKit.configure({ document: false }),
        GetPlaceholderExtension(),
        CounterComponentExtension(this.injector),
        ImageComponentExtension(this.injector),
        IframeComponentExtension(this.injector),
        EditableComponentExtension(this.injector),
        GetSlashMenuExtension(this.injector),
      ];
    } else {
      return [
        StarterKit,
        Placeholder.configure({
          emptyEditorClass: 'is-editor-empty',
          placeholder: 'Description...',
        }),
        ...defaultExtensions,
      ];
    }
  }

  setLink() {
    const previousUrl = this.editor.getAttributes('link').href;
    let url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      this.editor.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }

    if (!url.includes('//')) {
      url = 'https://' + url;
    }

    // update link
    this.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  addIframeTemplate() {
    this.editor.commands.insertContent(`
      <angular-component-iframe
        lessonRunCode="${this.lessonRunCode}">
        </angular-component-iframe>`);
  }
}

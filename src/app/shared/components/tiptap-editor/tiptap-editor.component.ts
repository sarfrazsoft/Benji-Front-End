import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Editor } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'benji-tiptap-editor',
  templateUrl: './tiptap-editor.component.html',
})
export class TiptapEditorComponent implements OnInit, OnChanges {
  @Input() defaultValue;
  @Input() editable = true;
  @Output() textChanged = new EventEmitter<string>();

  editorContent;
  editor = new Editor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder: 'Description...',
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'benji-link-class',
        },
        openOnClick: false,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none',
      },
    },
    onUpdate: (u) => {
      this.textChanged.emit(this.defaultValue);
    },
  });

  tippyOptions = {
    duration: [100, 250],
  };

  value = `
    <h2>
      Hi there,
    </h2>
    <p>
      this is a basic <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
    </p>
    <ul>
      <li>
        That’s a bullet list with one …
      </li>
      <li>
        … or two list items.
      </li>
    </ul>
    <p>
      Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
    </p>
  <pre><code class="language-css">body {
  display: none;
  }</code></pre>
    <p>
      I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
    </p>
    <blockquote>
      Wow, that’s amazing. Good work, boy! 👏
      <br />
      — Mom
    </blockquote>
  `;

  constructor(private utilsService: UtilsService, private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.editor.setEditable(this.editable);
  }
  ngOnChanges() {}

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
}

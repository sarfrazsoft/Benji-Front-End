import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Editor } from '@tiptap/core';
import { Underline } from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'benji-tiptap-editor',
  templateUrl: './tiptap-editor.component.html',
})
export class TiptapEditorComponent implements OnInit, OnChanges {
  @Input() defaultValue = '';
  @Input() editable = true;
  @Output() textChanged = new EventEmitter<string>();
  editor = new Editor({
    extensions: [StarterKit, Underline],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose xl:prose-lg m-5 focus:outline-none',
      },
    },
    onUpdate: (u) => {
      console.log(u);
      // this.editor.chain().focus().toggle

      console.log(this.value);
      this.textChanged.emit(this.value);
    },
  });
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
}

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import { wsRoot } from 'src/app/globals';
import { UtilsService } from 'src/app/services/utils.service';
import nodeViews from 'src/app/shared/ngx-editor/nodeviews/index';
import plugins, { placeholderPlugin } from 'src/app/shared/ngx-editor/plugins';
import { setAwareness } from 'src/app/shared/ngx-editor/plugins/cursor-plugin/cursor-plugin';
import schema from 'src/app/shared/ngx-editor/schema';
import { yCursorPlugin as OrginalYCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { yCursorPlugin } from '../../ngx-editor/plugins/cursor-plugin/cursor-plugin';

@Component({
  selector: 'benji-text-editor',
  templateUrl: './text-editor.component.html',
})
export class TextEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() documentId;
  @Input() participantCode: string;
  @Input() lessonRunCode: string;
  @Input() allowVideo = false;

  editor: Editor;
  editor2: Editor;

  toolbar: Toolbar = [
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['bold', 'italic', 'underline'],
    // ['underline', 'strike'],
    // ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    // ['link', 'image'],
    // ['text_color', 'background_color'],
    // ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  constructor(private utilsService: UtilsService, private httpClient: HttpClient) {}

  ngOnInit(): void {}

  initEditor() {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(wsRoot + '/yws/', this.documentId, ydoc);
    // provider.
    // const provider = new WebsocketProvider('wss://staging.mybenji.com/yws/', this.documentId, ydoc);
    // console.log(wsRoot + '/yws/');
    // const provider = new WebsocketProvider('ws://localhost/yws/', this.documentId, ydoc);
    // const provider = new WebsocketProvider('wss://prosemirror-collab.glitch.me/', this.documentId, ydoc);
    const type = ydoc.getXmlFragment('prosemirror');
    setAwareness(provider, this.participantCode);

    if (this.editor) {
      // console.log(this.editor.options.plugins);
      // this.editor.registerPlugin(ySyncPlugin(type));
      // this.editor.registerPlugin(yCursorPlugin(provider.awareness));
    } else {
      this.editor = new Editor({
        schema,
        plugins: [ySyncPlugin(type), yCursorPlugin(provider.awareness), ...plugins],
        nodeViews,
      });
    }
  }

  ngOnChanges() {
    this.initEditor();
    console.log(this.documentId);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}

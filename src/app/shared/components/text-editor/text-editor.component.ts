import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { wsRoot } from 'src/app/globals';
import { UtilsService } from 'src/app/services/utils.service';
import nodeViews from 'src/app/shared/ngx-editor/nodeviews/index';
import plugins, { placeholderPlugin } from 'src/app/shared/ngx-editor/plugins';
import { setAwareness } from 'src/app/shared/ngx-editor/plugins/cursor-plugin/cursor-plugin';
import { yCursorPlugin } from 'src/app/shared/ngx-editor/plugins/cursor-plugin/cursor-plugin';
import schema from 'src/app/shared/ngx-editor/schema';
import { yCursorPlugin as OrginalYCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

@Component({
  selector: 'benji-text-editor',
  templateUrl: './text-editor.component.html',
})
export class TextEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() documentId;
  @Input() participantCode: string;
  @Input() lessonRunCode: string;
  @Input() allowVideo = false;
  @Input() disabled = false;
  @Input() jsonDoc;
  @Input() showMenu = true;
  @Input() activityId = false;

  @Input() html;
  @Output() editorUpdated = new EventEmitter<any>();

  editor: Editor;

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

  ngOnInit(): void {
    this.initEditor();
  }

  // TODO set editor collaborative or not based on input variable
  initEditor() {
    const ydoc = new Y.Doc();
    const type = ydoc.getXmlFragment('prosemirror');
    let provider;
    if (this.documentId) {
      provider = new WebsocketProvider(wsRoot + '/yws/', this.documentId, ydoc);
    } else {
      const random = new Date().getTime();
      provider = new WebsocketProvider(wsRoot + '/yws/', random + '', ydoc);
    }
    // const provider = new WebsocketProvider('wss://staging.mybenji.com/yws/', this.documentId, ydoc);
    // const provider = new WebsocketProvider('ws://localhost/yws/', this.documentId, ydoc);
    // const provider = new WebsocketProvider('wss://prosemirror-collab.glitch.me/', this.documentId, ydoc);

    if (this.participantCode) {
      setAwareness(provider, this.participantCode);
    } else {
      setAwareness(provider, '00');
    }

    this.editor = new Editor({
      // content: this.jsonDoc,
      enabled: !this.disabled,
      schema,
      plugins: [ySyncPlugin(type), yCursorPlugin(provider.awareness), ...plugins],
      nodeViews,
    });
    if (this.jsonDoc) {
      // const defaultContentKey = this.activityId + this.participantCode;
      const defaultContentKey = this.documentId;
      if (this.activityId && !localStorage.getItem(defaultContentKey)) {
        this.editor.setContent(this.jsonDoc);
        localStorage.setItem(defaultContentKey, 'true');
      } else {
        if (!this.activityId) {
          this.editor.setContent(this.jsonDoc);
        }
      }
      // this.editor.setContent(this.jsonDoc);
    }
  }

  ngOnChanges() {
    // this.initEditor();
  }
  onChange(json: object) {
    // console.log(json);
    this.editorUpdated.emit(json);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import { UtilsService } from 'src/app/services/utils.service';
import nodeViews from 'src/app/shared/ngx-editor/nodeviews/index';
import plugins, { placeholderPlugin } from 'src/app/shared/ngx-editor/plugins';
import { getUserName } from 'src/app/shared/ngx-editor/plugins';
import schema from 'src/app/shared/ngx-editor/schema';
import { yCursorPlugin as OrginalYCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

@Component({
  selector: 'benji-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements OnInit, OnDestroy {
  @Input() documentId;
  @Input() participant_code: string;
  @Input() lessonrun_code: string;

  editor: Editor;
  editor2: Editor;
  colors = [
    { color: '#ffffff', backgroudColor: '#e6194b' },
    { color: '#ffffff', backgroudColor: '#3cb44b' },
    { color: '#000000', backgroudColor: '#ffe119' },
    { color: '#ffffff', backgroudColor: '#4363d8' },
    { color: '#ffffff', backgroudColor: '#f58231' },
    { color: '#ffffff', backgroudColor: '#911eb4' },
    { color: '#000000', backgroudColor: '#46f0f0' },
    { color: '#ffffff', backgroudColor: '#f032e6' },
    { color: '#000000', backgroudColor: '#bcf60c' },
    { color: '#000000', backgroudColor: '#fabebe' },
    { color: '#ffffff', backgroudColor: '#469990' },
    { color: '#000000', backgroudColor: '#008080' },
    { color: '#000000', backgroudColor: '#e6beff' },
    { color: '#ffffff', backgroudColor: '#9a6324' },
    { color: '#000000', backgroudColor: '#fffac8' },
    { color: '#ffffff', backgroudColor: '#800000' },
    { color: '#000000', backgroudColor: '#aaffc3' },
    { color: '#ffffff', backgroudColor: '#808000' },
    { color: '#000000', backgroudColor: '#ffd8b1' },
    { color: '#ffffff', backgroudColor: '#000075' },
    { color: '#000000', backgroudColor: '#808080' },
    { color: '#000000', backgroudColor: '#ffffff' },
    { color: '#ffffff', backgroudColor: '#000000' },
    { color: '#ffffff', backgroudColor: '#a9a9a9' },
  ];
  toolbar: Toolbar = [
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['bold', 'italic'],
    ['underline'],
    // ['underline', 'strike'],
    // ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    // ['link', 'image'],
    ['text_color', 'background_color'],
    // ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  constructor(private utilsService: UtilsService, private httpClient: HttpClient) {}

  ngOnInit(): void {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:1234', 'prosemirror-demo1', ydoc);
    const type = ydoc.getXmlFragment('prosemirror');

    //
    //
    // Remote cursor user's name
    //
    //
    //
    const awareness = provider.awareness;
    // get participant information here
    const userName = getUserName();

    const colorIndex = this.randomIntFromInterval(0, 19);
    awareness.setLocalStateField('user', {
      // Define a print name that should be displayed
      name: userName ? userName : 'Panda',
      // Define a color that should be associated to the user:
      color: this.colors[colorIndex].color, // should be a hex color
      backgroudColor: this.colors[colorIndex].backgroudColor, // should be a hex color
      // typing: false,
    });

    this.editor = new Editor({
      schema,
      plugins: [ySyncPlugin(type), ...plugins],
      nodeViews,
    });
  }

  ngOnDestroy(): void {
    this.editor2.destroy();
    this.editor.destroy();
  }

  randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

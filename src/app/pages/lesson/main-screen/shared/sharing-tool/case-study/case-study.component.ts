import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import { wsRoot } from 'src/app/globals';
import { BuildAPitchService } from 'src/app/services/activities';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { Participant } from 'src/app/services/backend/schema/course_details';
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
  selector: 'benji-case-study',
  templateUrl: './case-study.component.html',
})
export class CaseStudyComponent implements OnInit, OnChanges, OnDestroy {
  @Input() activityState: UpdateMessage;
  @Input() currentSpeaker: { displayName: string; id: number };
  jsonDoc;
  // editor: Editor;
  showEditor = false;
  constructor(private buildAPitchService: BuildAPitchService) {}

  ngOnInit(): void {}

  ngOnChanges() {}

  update() {
    this.activityState.casestudyactivity.groups.forEach((group) => {
      if (group.id === this.currentSpeaker.id) {
        this.showEditor = false;
        setTimeout(() => {
          this.showEditor = true;
          this.initEditor(group);
        });
      }
    });
  }

  initEditor(group) {
    if (group && group.answer && group.answer.doc) {
      this.jsonDoc = group.answer.doc;
    }
    // const ydoc = new Y.Doc();
    // const provider = new WebsocketProvider(wsRoot + '/yws/', 'xx', ydoc);
    // const type = ydoc.getXmlFragment('prosemirror');
    // setAwareness(provider, '00');
    // this.editor = new Editor({
    //   schema,
    //   plugins: [ySyncPlugin(type), yCursorPlugin(provider.awareness), ...plugins],
    //   nodeViews,
    // });
    // this.editor.setContent(this.jsonDoc.doc);
    // this.editor.disable();
  }

  ngOnDestroy() {
    // this.editor.destroy();
  }
}

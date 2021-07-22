import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import { wsRoot } from 'src/app/globals';
import { BuildAPitchService } from 'src/app/services/activities';
import { Group, UpdateMessage } from 'src/app/services/backend/schema';
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
  editorString;
  // editor: Editor;
  showEditor = false;

  questions = [];
  group;
  constructor(private buildAPitchService: BuildAPitchService) {}

  ngOnInit(): void {}

  ngOnChanges() {}

  update() {
    this.activityState.casestudyactivity.groups.forEach((group) => {
      if (group.id === this.currentSpeaker.id) {
        // this.showEditor = false;
        // setTimeout(() => {
        this.showEditor = true;
        this.populateQuestions();
        this.group = group;
        // console.log(group);
        // this.initEditor(group);
        // });
      }
    });
  }

  // initEditor(group) {
  //   if (group && group.answer && group.answer.doc) {
  //     this.group = group;
  //     this.jsonDoc = group.answer.doc;
  //   } else {
  //     this.jsonDoc = null;
  //   }
  // }

  // getMyGroup(userId): Group {
  //   const act = this.activityState.casestudyactivity;
  //   for (let i = 0; i < act.groups.length; i++) {
  //     const group = act.groups[i];
  //     const groupParticipants = group.participants;
  //     if (groupParticipants.includes(userId)) {
  //       return group;
  //     }
  //   }
  // }

  populateQuestions() {
    const questionsTemp = this.activityState.casestudyactivity.casestudyquestion_set;
    this.questions = [];
    questionsTemp.forEach((q, i) => {
      this.questions.push({ ...q });
    });
  }

  ngOnDestroy() {}
}

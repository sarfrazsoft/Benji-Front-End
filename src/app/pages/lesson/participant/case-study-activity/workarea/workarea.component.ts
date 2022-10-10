import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as global from 'src/app/globals';
import {
  CaseStudyActivity,
  CaseStudyDefaultWorksheetApplied,
  CaseStudySubmitAnswerEvent,
  Group,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { GroupingToolGroups } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-case-study-workarea',
  templateUrl: './workarea.component.html',
})
export class WorkAreaComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  @Input() actEditor;
  @Input() questionId;
  @Input() defaultEditorContent;
  @Input() activityId;
  @Input() jsonDoc;
  @Input() lessonRunCode;
  @Input() participantCode: number;
  @Input() documentId;
  @Input() allowVideo;
  @Input() editorDisabled;
  @Input() showingToFacilitator = false;
  @Input() facilitatorSelectedGroup: Group;
  act;
  answeredJson;

  // unique ID for the group
  groupId: string;
  constructor() {}

  @Output() sendMessage = new EventEmitter<any>();
  @Output() questionAnswerUpdated = new EventEmitter<any>();

  selectedParticipant;
  saved;

  ngOnInit(): void {
    this.act = this.activityState.casestudyactivity;
    if (this.actEditor) {
      this.editorDisabled = true;
      this.groupId = '1234';
      this.participantCode = 1234;
      this.documentId = new Date().getTime().toString();
      this.lessonRunCode = '33';
      if (this.defaultEditorContent) {
        this.jsonDoc = JSON.parse(this.defaultEditorContent);
      } else {
        this.jsonDoc = JSON.parse(
          '{"type":"doc","content":[{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"Worksheet details go here."}]}]}'
        );
      }
    } else {
      this.initVariables();
    }
  }
  ngOnChanges() {
    // console.log('onchanges');
    this.act = this.activityState.casestudyactivity;

    // find out if your grouping just changed
    const particiapntCode = this.participantCode;
    const myGroup = this.getMyGroup(particiapntCode);
    if (myGroup) {
      if (this.groupId !== myGroup.id.toString() && this.groupId !== undefined) {
        // group has changed
        this.initVariables();
      }
    }
  }

  initVariables() {
    this.lessonRunCode = this.activityState.lesson_run.lessonrun_code.toString();
    this.jsonDoc = null;
    this.activityId = this.activityState.casestudyactivity.activity_id;
    if (this.showingToFacilitator) {
    } else {
      if (this.defaultEditorContent) {
        // default data is set by the participant with the lowest participantCode
        // and also added to localstorage so that it's not added again
        const myGroup = this.getMyGroup(this.participantCode);
        const sortedParticipant = myGroup.participants.sort((a, b) => a - b);
        if (this.participantCode === sortedParticipant[0] && !myGroup.default_worksheet_applied) {
          this.jsonDoc = JSON.parse(this.defaultEditorContent);
          this.sendMessage.emit(new CaseStudyDefaultWorksheetApplied(true));
        } else {
          this.jsonDoc = null;
        }
      }
    }
    // console.log(this.jsonDoc);
    this.groupId = null;
    setTimeout(() => {
      this.editorDisabled = false;

      let myGroup = this.getMyGroup(this.participantCode);
      if (this.facilitatorSelectedGroup) {
        myGroup = this.facilitatorSelectedGroup;
      }
      const selectedGrouping = this.getMyGrouping();
      let moddedGroupId;
      if (myGroup && myGroup.id) {
        this.groupId = myGroup.id.toString();

        // create a unique ID by combining groupId and Lesson run code
      } else {
        // if participant is not part of any group
        this.groupId = 'x';
      }
      if (moddedGroupId) {
        this.documentId = moddedGroupId + this.lessonRunCode + this.questionId;
      } else {
        this.documentId = this.groupId + this.lessonRunCode + this.questionId;
      }
    }, 0);
  }

  initSelectedGroup(act) {}
  changeGroup(event) {}

  getMyGroup(userId): Group {
    const act = this.activityState.casestudyactivity;
    for (let i = 0; i < act.groups.length; i++) {
      const group = act.groups[i];
      const groupParticipants = group.participants;
      if (groupParticipants.includes(userId)) {
        return group;
      }
    }
  }

  getMyGrouping() {}

  editorUpdated(json) {
    // console.log(json);
    this.answeredJson = json;
    this.questionAnswerUpdated.emit({ [this.questionId]: this.answeredJson });
    // this.sendMessage.emit(new CaseStudySubmitAnswerEvent(this.questionId, json));
  }
}

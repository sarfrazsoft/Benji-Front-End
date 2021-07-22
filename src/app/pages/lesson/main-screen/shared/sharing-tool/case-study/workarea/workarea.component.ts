import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as global from 'src/app/globals';
import {
  CaseStudyActivity,
  CaseStudyDefaultWorksheetApplied,
  CaseStudySubmitAnswerEvent,
  Group,
  GroupingParticipantSelfJoinEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { GroupingToolGroups } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-sharing-case-study-workarea',
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
  @Input() group;
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
    console.log(this.group);
    this.jsonDoc = this.group.answer[this.questionId];
  }
  ngOnChanges() {}
}

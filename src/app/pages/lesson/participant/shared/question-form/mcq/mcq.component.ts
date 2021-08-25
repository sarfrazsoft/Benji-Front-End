import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import {
  // GroupingParticipantJoinEvent,
  GroupingParticipantSelfJoinEvent,
  ParticipantOptInEvent,
  ParticipantOptOutEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { GroupingToolGroups, Participant } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-ps-feedback-mcq',
  templateUrl: './mcq.component.html',
})
export class ParticipantFeedbackMCQComponent implements OnInit, OnChanges {
  @Input() question;
  @Input() activityState: UpdateMessage;
  @Input() actEditor = false;
  isMultiSelect = false;
  identifier = ['A', 'B', 'C', 'D', 'E'];
  selected = {};

  @Output() selectChoice = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {
    const json = JSON.parse(this.question.question_json);
    this.isMultiSelect = json.multiSelect ? true : false;

    if (this.actEditor) {
      this.question = {
        ...this.question,
        mcq_question: {
          mcqchoice_set: json.mcqchoices,
        },
      };
    }
  }

  ngOnChanges() {}

  mcqChoiceSelect(selectedChoiceId: number) {
    if (this.actEditor) {
    } else {
      this.selectChoice.emit({ isMultiSelect: this.isMultiSelect, selectedChoiceId: selectedChoiceId });
      if (this.isMultiSelect) {
        this.selected = {
          ...this.selected,
          [selectedChoiceId]: true,
        };
      } else {
        this.selected = { [selectedChoiceId]: true };
      }
    }
  }
}

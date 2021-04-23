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
  selector: 'benji-ps-grouping-tool',
  templateUrl: './grouping-tool.component.html',
})
export class ParticipantGroupingToolComponent implements OnInit, OnChanges {
  selfGroupingAllowed = true;
  selectedGrouping: GroupingToolGroups;
  groups: GroupingToolGroups['groups'] = [];
  userGroupAssigned = false;
  selectedChoice = {
    id: null,
    is_correct: null,
    choice_text: null,
    explanation: null,
    order: null,
  };
  @Input() activityState: UpdateMessage;
  @Output() sendMessage = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.initSelectedGroup(this.activityState.running_tools.grouping_tool);
  }

  initSelectedGroup(grouping) {
    grouping.groupings.forEach((g: GroupingToolGroups) => {
      if (grouping.selectedGrouping === g.id) {
        this.selectedGrouping = g;
        this.groups = g.groups;
        this.selfGroupingAllowed = g.allowParticipantsJoining;
        const participantCode = this.getParticipantCode();
        this.userGroupAssigned = !g.unassignedParticipants.includes(participantCode);
      }
    });
  }

  getParticipantCode(): number {
    let details: Participant;
    if (localStorage.getItem('participant')) {
      details = JSON.parse(localStorage.getItem('participant'));
      return details.participant_code;
    }
  }

  selectOption(option) {
    this.selectedChoice = option;
    console.log(this.selectedChoice);
  }

  joinGroup() {
    this.sendMessage.emit(new GroupingParticipantSelfJoinEvent(this.selectedChoice.id));
  }
}

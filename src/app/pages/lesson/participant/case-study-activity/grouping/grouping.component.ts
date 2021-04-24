import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as global from 'src/app/globals';
import { GroupingParticipantSelfJoinEvent } from 'src/app/services/backend/schema';
import { GroupingToolGroups } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-case-study-grouping-container',
  templateUrl: './grouping.component.html',
})
export class GroupingComponent implements OnInit, OnChanges {
  constructor() {}
  group;
  groups = [];
  selfGroupingAllowed: boolean;
  userGroupAssigned: boolean;
  @Input() activityState;
  @Input() participantCode;
  @Output() sendMessage = new EventEmitter<any>();

  ngOnInit(): void {}
  ngOnChanges() {
    this.initSelectedGroup(this.activityState.running_tools.grouping_tool);
  }

  initSelectedGroup(grouping) {
    grouping.groupings.forEach((g: GroupingToolGroups) => {
      if (grouping.selectedGrouping === g.id) {
        // this.selectedGrouping = g;
        this.groups = g.groups;
        this.selfGroupingAllowed = g.allowParticipantsJoining;
        const participantCode = this.participantCode;
        this.userGroupAssigned = !g.unassignedParticipants.includes(participantCode);
      }
    });
  }
  changeGroup(event) {
    this.sendMessage.emit(new GroupingParticipantSelfJoinEvent(3));
  }
}

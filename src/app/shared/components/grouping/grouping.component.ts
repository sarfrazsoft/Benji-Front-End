import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as global from 'src/app/globals';
import { GroupingParticipantSelfJoinEvent, UpdateMessage } from 'src/app/services/backend/schema';
import { GroupingToolGroups } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-participant-grouping-container',
  templateUrl: './grouping.component.html',
})
export class GroupingComponent implements OnInit, OnChanges {
  constructor() {}
  group;
  groups = [];
  selfGroupingAllowed = false;
  midActivityGroupingAllowed = false;
  userGroupAssigned: boolean;
  myGroupId;
  grouping;
  @Input() activityState: UpdateMessage;
  @Input() participantCode;
  @Output() sendMessage = new EventEmitter<any>();

  ngOnInit(): void {
    this.initSelectedGroup(this.activityState);
  }
  ngOnChanges() {
    // check if group changed
    // then call initseelctedgroup
    this.initSelectedGroup(this.activityState);
  }

  initSelectedGroup(act) {
    if (act.running_tools && act.running_tools.grouping_tool) {
      this.grouping = act.running_tools.grouping_tool;
      const grouping = act.running_tools.grouping_tool;
      grouping.groupings.forEach((g: GroupingToolGroups) => {
        if (grouping.selectedGrouping === g.id) {
          // this.selectedGrouping = g;
          this.groups = g.groups;
          this.selfGroupingAllowed = g.allowParticipantsJoining;
          this.midActivityGroupingAllowed = g.allowParticipantsJoiningMidActivity;
          const participantCode = parseInt(this.participantCode, 10);
          const activity_type = this.activityState.activity_type.toLowerCase();

          const group = this.getMyGroup(participantCode, this.activityState[activity_type].groups);
          this.myGroupId = group ? group.id : null;

          this.userGroupAssigned = !g.unassignedParticipants.includes(participantCode);
        }
      });
    }
  }
  changeGroup(event) {
    // this.sendMessage.emit(new GroupingParticipantSelfJoinEvent(event.id));
  }

  getMyGroup(userId, groups) {
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const groupParticipants = group.participants;
      if (groupParticipants.includes(userId)) {
        return group;
      }
    }
  }
}

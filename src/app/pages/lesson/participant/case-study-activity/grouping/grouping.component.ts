import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as global from 'src/app/globals';
import { GroupingParticipantSelfJoinEvent, UpdateMessage } from 'src/app/services/backend/schema';
import { GroupingToolGroups } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-case-study-grouping-container',
  templateUrl: './grouping.component.html',
})
export class GroupingComponent implements OnInit, OnChanges {
  constructor() {}
  group;
  groups = [];
  selfGroupingAllowed = false;
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
          const participantCode = parseInt(this.participantCode, 10);

          const group = this.getMyGroup(participantCode);
          this.myGroupId = group ? group.id : null;

          this.userGroupAssigned = !g.unassignedParticipants.includes(participantCode);
        }
      });
    }
  }
  changeGroup(event) {
    this.sendMessage.emit(new GroupingParticipantSelfJoinEvent(event.id));
  }

  getMyGroup(userId) {
    for (let i = 0; i < this.activityState.casestudyactivity.groups.length; i++) {
      const group = this.activityState.casestudyactivity.groups[i];
      const groupParticipants = group.participants;
      if (groupParticipants.includes(userId)) {
        return group;
      }
    }
  }
}

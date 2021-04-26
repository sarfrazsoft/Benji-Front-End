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
  selfGroupingAllowed = false;
  userGroupAssigned: boolean;
  myGroupId;
  grouping;
  @Input() activityState;
  @Input() participantCode;
  @Output() sendMessage = new EventEmitter<any>();

  ngOnInit(): void {
    this.initSelectedGroup(this.activityState);
  }
  ngOnChanges() {
    this.initSelectedGroup(this.activityState);
  }

  initSelectedGroup(act) {
    if (act.running_tools && act.running_tools.grouping_tool) {
      this.grouping = act.running_tools.grouping_tool;
      const grouping = act.running_tools.grouping_tool;
      grouping.groupings.forEach((g: GroupingToolGroups) => {
        if (grouping.selectedGrouping === g.id) {
          // this.selectedGrouping = g;

          console.log(this.groups);
          this.selfGroupingAllowed = g.allowParticipantsJoining;
          const participantCode = parseInt(this.participantCode, 10);

          for (let i = 0; i < this.groups.length; i++) {
            const group = this.groups[0];
            if (group.participants.includes(participantCode)) {
              this.myGroupId = group.id;
            }
          }
          this.groups = g.groups;
          this.userGroupAssigned = !g.unassignedParticipants.includes(participantCode);
        }
      });
    }
  }
  changeGroup(event) {
    this.sendMessage.emit(new GroupingParticipantSelfJoinEvent(event.id));
  }
}

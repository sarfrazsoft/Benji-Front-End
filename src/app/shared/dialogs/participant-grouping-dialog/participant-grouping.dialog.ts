import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivitiesService } from 'src/app/services/activities';
import {
  AllowParticipantGroupingMidActivityEvent,
  Group,
  GroupingParticipantSelfJoinEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import {
  GroupingTool,
  GroupingToolGroups,
  Participant,
} from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-participant-grouping-dialog',
  templateUrl: 'participant-grouping.dialog.html',
})
export class ParticipantGroupingDialogComponent implements OnInit, OnChanges {
  selfGroupingAllowed = true;
  selectedGrouping: GroupingToolGroups;
  groups: GroupingToolGroups['groups'] = [];
  userGroupAssigned = false;
  selectedGroup;
  participantCode: number;
  @Input() activityState: UpdateMessage;
  @Output() sendMessage = new EventEmitter<any>();
  constructor(
    private dialogRef: MatDialogRef<ParticipantGroupingDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { activityState: UpdateMessage; participantCode: number },
    private matDialog: MatDialog,
    private activitiesService: ActivitiesService
  ) {
    this.activityState = data.activityState;
    this.participantCode = data.participantCode;
  }

  ngOnInit() {
    this.initSelectedGroup(this.activityState.running_tools.grouping_tool);
  }

  ngOnChanges() {}

  closeDialog() {
    this.dialogRef.close();
  }

  toggleMidActChooseGroup($event) {
    this.sendMessage.emit(new AllowParticipantGroupingMidActivityEvent($event.currentTarget.checked));
  }

  initSelectedGroup(grouping) {
    grouping.groupings.forEach((g: GroupingToolGroups) => {
      if (grouping.selectedGrouping === g.id) {
        this.selectedGrouping = g;
        this.groups = g.groups;
        this.selectedGroup = this.getParticipantGroup(g);
        this.selfGroupingAllowed = g.allowParticipantsJoining;
        const participantCode = this.participantCode;
        this.userGroupAssigned = !g.unassignedParticipants.includes(participantCode);
      }
    });
  }

  getParticipantGroup(grouping: GroupingToolGroups) {
    let myGroup;
    grouping.groups.forEach((g) => {
      if (g.participants.includes(this.participantCode)) {
        myGroup = g;
      }
    });
    return myGroup;
  }

  updateGroupingInfo(gt: GroupingTool) {
    const grouping = {
      groupings: gt.groupings,
      selectedGrouping: gt.selectedGrouping,
    };
    this.initSelectedGroup(grouping);
  }

  getParticipantCode(): number {
    let details: Participant;
    if (localStorage.getItem('participant')) {
      details = JSON.parse(localStorage.getItem('participant'));
      return details.participant_code;
    }
  }

  selectOption(group) {
    this.selectedGroup = group;
    this.joinGroup();
  }

  joinGroup() {
    this.sendMessage.emit(
      new GroupingParticipantSelfJoinEvent(this.selectedGrouping.id, this.selectedGroup.id)
    );
  }

  getInitials(participantCode: number) {
    const nameString = this.activitiesService.getParticipantName(this.activityState, participantCode);
    const fullName = nameString.split(' ');
    let inits = '';
    fullName.forEach((name) => {
      inits = inits + name.charAt(0);
    });
    return inits.toUpperCase();
  }
}

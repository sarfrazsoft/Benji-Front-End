import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllowParticipantGroupingMidActivityEvent, UpdateMessage } from 'src/app/services/backend/schema';
import {
  GroupingTool,
  GroupingToolGroups,
  Participant,
} from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-participant-grouping-info-dialog',
  templateUrl: 'participant-grouping-info.dialog.html',
})
export class ParticipantGroupingInfoDialogComponent implements OnInit, OnChanges {
  selfGroupingAllowed = true;
  selectedGrouping: GroupingToolGroups;
  groups: GroupingToolGroups['groups'] = [];
  userGroupAssigned = false;
  groupingStyle = 'hostAssigned';
  selectedChoice = {
    id: null,
    is_correct: null,
    choice_text: null,
    explanation: null,
    order: null,
  };
  participantCode: number;
  @Input() activityState: UpdateMessage;
  @Output() sendMessage = new EventEmitter<any>();
  constructor(
    private dialogRef: MatDialogRef<ParticipantGroupingInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { activityState: UpdateMessage; participantCode: number },
    private matDialog: MatDialog
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
    if (!grouping.groupings) {
      return;
    }
    grouping.groupings.forEach((g: GroupingToolGroups) => {
      if (grouping.selectedGrouping === g.id) {
        this.selectedGrouping = g;
        this.groups = g.groups;
        this.groupingStyle = g.style;
        this.selfGroupingAllowed = g.allowParticipantsJoining;
        const participantCode = this.participantCode;
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

  openGroupingDialog() {
    this.dialogRef.close('openDialog');
  }

  updateGroupingInfo(gt: GroupingTool) {
    this.initSelectedGroup(gt);
  }
}

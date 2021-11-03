import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/services/backend/schema';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import {
  AllowParticipantGroupingEvent,
  AllowParticipantGroupingMidActivityEvent,
  CreateGroupEvent,
  DeleteGroupingGroupEvent,
  EditGroupingTitleEvent,
  EditGroupTitleEvent,
  GroupingAssignParticipantEvent,
  StartCaseStudyGroupEvent,
  UpdateMessage,
  ViewGroupingEvent,
} from 'src/app/services/backend/schema';
import { GroupingToolGroups } from 'src/app/services/backend/schema/course_details';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'benji-grouping-tool-dialog',
  templateUrl: 'grouping-tool.dialog.html',
})
export class GroupingToolDialogComponent implements OnInit, OnChanges {
  groupingTitle = '';
  selectedGroup: GroupingToolGroups;
  unassignedUsers = [];
  breakoutRooms: Array<{ id: number; name: string; participants: Array<any> }> = [];
  collapsed = {};
  editingName = {};
  groupName = '';
  showStartGroupingButton: boolean;
  private typingTimer;
  numberOfRooms = 0;
  editingTitle = false;

  activityState: UpdateMessage;
  @Output() sendMessage = new EventEmitter<any>();
  categories = ['Individual', 'Custom', 'Self-Assign']
  constructor(
    private dialogRef: MatDialogRef<GroupingToolDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { activityState: UpdateMessage; },
    private matDialog: MatDialog,
    private utilsService: UtilsService
  ) {
    this.activityState = data.activityState;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    const code =
      this.activityState.casestudyactivity.activity_id + this.activityState.lesson_run.lessonrun_code;
    if (localStorage.getItem('isGroupingCreated') === code) {
      this.showStartGroupingButton = false;
    } else {
      this.showStartGroupingButton = true;
    }
  }

  ngOnChanges() {
    const grouping = {
      groupings: this.activityState.running_tools.grouping_tool.groupings,
      selectedGrouping: this.activityState.running_tools.grouping_tool.selectedGrouping,
    };
    this.initSelectedGroup(grouping);

    this.initGroups(grouping);
  }

  initSelectedGroup(grouping) {
    grouping.groupings.forEach((g: GroupingToolGroups) => {
      if (grouping.selectedGrouping === g.id) {
        this.selectedGroup = g;
        this.groupingTitle = g.title;
        // this.unassignedUsers = g.unassignedParticipants;
      }
    });
  }

  initGroups(grouping) {
    const allUsers = this.activityState.lesson_run.participant_set;
    let unassignedUsers = [];
    let selectedgrouping: GroupingToolGroups;
    this.breakoutRooms = [];
    grouping.groupings.forEach((g: GroupingToolGroups) => {
      if (grouping.selectedGrouping === g.id) {
        selectedgrouping = g;
        unassignedUsers = g.unassignedParticipants;
      }
    });

    this.unassignedUsers = [];
    for (let j = 0; j < unassignedUsers.length; j++) {
      const participantCode = unassignedUsers[j];
      for (let k = 0; k < allUsers.length; k++) {
        const user = allUsers[k];
        if (user.participant_code === participantCode) {
          this.unassignedUsers.push(user);
          // allUsers.splice(k, 1);
        }
      }
    }

    if (!selectedgrouping) {
      return;
    }
    for (let i = 0; i < selectedgrouping.groups.length; i++) {
      const groupset = selectedgrouping.groups[i];
      const participants = [];
      for (let j = 0; j < groupset.participants.length; j++) {
        const participantCode = groupset.participants[j];
        for (let k = 0; k < allUsers.length; k++) {
          const user = allUsers[k];
          if (user.participant_code === participantCode) {
            participants.push(user);
            // allUsers.splice(k, 1);
          }
        }
      }

      // form a list of participants like externalgroupingactivity
      this.breakoutRooms.push({
        id: groupset.id,
        name: groupset.title,
        participants: participants,
      });
    }
    if (this.numberOfRooms === 0) {
      this.numberOfRooms = this.breakoutRooms.length;
    }
  }

  typingStoped(event) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.doneTyping();
    }, 1500);
  }

  // on keydown, clear the countdown
  typingStarted() {
    clearTimeout(this.typingTimer);
  }

  doneTyping() {
    this.sendMessage.emit(new EditGroupingTitleEvent(this.selectedGroup.id, this.groupingTitle));
  }

  toggleChooseGroup($event) {
    this.sendMessage.emit(new AllowParticipantGroupingEvent($event.currentTarget.checked));
  }

  toggleMidActChooseGroup($event) {
    this.sendMessage.emit(new AllowParticipantGroupingMidActivityEvent($event.currentTarget.checked));
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // this.sendCategorizeEvent(event);
      const participant: any = event.container.data[event.currentIndex];
      let breakoutroomid;
      this.breakoutRooms.forEach((b) => {
        b.participants.forEach((p) => {
          if (p.participant_code === participant.participant_code) {
            breakoutroomid = b.id;
          }
        });
      });
      this.sendMessage.emit(new GroupingAssignParticipantEvent(breakoutroomid, participant.participant_code));
    }
  }

  addGroup() {
    const number = this.numberOfRooms + 1;
    const name = 'Room ' + number;
    this.numberOfRooms++;
    this.sendMessage.emit(new CreateGroupEvent(this.selectedGroup.id, name));
  }

  makeActivityGrouping() {
    // check if at least one group has at least one participant
    if (this.groupingsValid()) {
      const code =
        this.activityState.casestudyactivity.activity_id + this.activityState.lesson_run.lessonrun_code;
      window.localStorage.setItem('isGroupingCreated', code);
      this.sendMessage.emit(new StartCaseStudyGroupEvent());
      this.showStartGroupingButton = false;
      this.sendMessage.emit(new ViewGroupingEvent(false));
    } else {
      this.utilsService.openWarningNotification('Add participants to the groups', '');
    }
  }

  groupingsValid(): boolean {
    let check = false;
    this.breakoutRooms.forEach((room) => {
      if (room.participants.length) {
        check = true;
      }
    });
    return check;
  }

  editGroupName(group) {
    this.editingName[group.id] = true;
    this.groupName = group.name;
  }

  saveEditedGroupName(group) {
    this.sendMessage.emit(new EditGroupTitleEvent(group.id, this.groupName));
    this.editingName[group.id] = false;
  }

  deleteGroup(group) {
    this.sendMessage.emit(new DeleteGroupingGroupEvent(group.id));
  }

  editTitle() {
    this.editingTitle = !this.editingTitle;
  }

}

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'benji-ms-grouping-tool',
  templateUrl: './grouping-tool.component.html',
})
export class MainScreenGroupingToolComponent implements OnInit, OnChanges {
  groupingTitle = '';
  selectedGroup: GroupingToolGroups;
  unassignedUsers = [];
  breakoutRooms = [];
  collapsed = {};
  showStartGroupingButton: boolean;
  private typingTimer;

  @Input() activityState: UpdateMessage;
  @Output() sendMessage = new EventEmitter<any>();
  constructor() {}

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
    const number = this.breakoutRooms.length + 1;
    const name = 'Room ' + number;
    this.sendMessage.emit(new CreateGroupEvent(this.selectedGroup.id, name));
  }

  makeActivityGrouping() {
    const code =
      this.activityState.casestudyactivity.activity_id + this.activityState.lesson_run.lessonrun_code;
    window.localStorage.setItem('isGroupingCreated', code);
    this.sendMessage.emit(new StartCaseStudyGroupEvent());
    this.showStartGroupingButton = false;
    this.sendMessage.emit(new ViewGroupingEvent(false));
  }

  deleteGroup(group) {
    this.sendMessage.emit(new DeleteGroupingGroupEvent(group.id));
  }
}

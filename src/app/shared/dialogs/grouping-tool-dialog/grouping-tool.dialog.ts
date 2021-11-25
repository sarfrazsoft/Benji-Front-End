import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs-compat/Observable';
import { ActivityTypes } from 'src/app/globals';
import { ActivitiesService, BackendRestService } from 'src/app/services';
import {
  Category,
  CreateGroupsEvent,
  StartBrainstormGroupEvent,
  UpdateGroupingStyleEvent,
} from 'src/app/services/backend/schema';
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
  groupingTitle;
  selectedGrouping: GroupingToolGroups;
  unassignedUsers = [];
  breakoutRooms: Array<{ id: number; name: string; participants: Array<any> }> = [];
  collapsed = {};
  editingName = {};
  groupName = '';
  showStartGroupingButton: boolean;
  allowParticipantsJoiningMidActivity: boolean;
  private typingTimer;
  private typingTimerGroups;
  numberOfRooms = 0;
  editingTitle = false;
  groupAccess = false;
  groupsCount = 1;

  activityState: UpdateMessage;
  @Output() sendMessage = new EventEmitter<any>();
  groupingStyles = [
    { type: 'hostAssigned', title: 'Custom', description: `Host assigns people` },
    { type: 'selfAssigned', title: 'Self-Assign', description: `People choose their group` },
  ];

  activities$: Observable<any[]>;

  at: typeof ActivityTypes = ActivityTypes;
  selectedActivities = [];

  constructor(
    private dialogRef: MatDialogRef<GroupingToolDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { activityState: UpdateMessage },
    private matDialog: MatDialog,
    private utilsService: UtilsService,
    private activitiesService: ActivitiesService,
    private backendRestService: BackendRestService
  ) {
    this.activityState = data.activityState;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    const state = this.activityState;
    const activityID = this.activitiesService.getActivityID(state);
    const code = activityID + state.lesson_run.lessonrun_code;

    // if (localStorage.getItem('isGroupingCreated') === code) {
    //   this.showStartGroupingButton = false;
    // } else {
    this.showStartGroupingButton = true;
    // }
    const grouping = {
      groupings: this.activityState.running_tools.grouping_tool.groupings,
      selectedGrouping: this.activityState.running_tools.grouping_tool.selectedGrouping,
    };
    this.initSelectedGroup(grouping);

    this.getLessonActivities();
  }

  ngOnChanges() {
    // const grouping = {
    //   groupings: this.activityState.running_tools.grouping_tool.groupings,
    //   selectedGrouping: this.activityState.running_tools.grouping_tool.selectedGrouping,
    // };
    // this.initSelectedGroup(grouping);
    // this.initGroups(grouping);
  }

  groupingStyleChanged(event) {
    if (event.type === 'selfAssigned') {
      this.sendMessage.emit(new ViewGroupingEvent(true));
    } else {
      // hostAssigned
      this.sendMessage.emit(new ViewGroupingEvent(true));
    }
  }

  initSelectedGroup(grouping) {
    console.log(grouping);
    grouping.groupings.forEach((g: GroupingToolGroups) => {
      if (grouping.selectedGrouping === g.id) {
        this.selectedGrouping = g;
        this.groupingTitle = g.title;
        if (g.style === 'hostAssigned') {
          this.groupAccess = false;
        } else if (g.style === 'selfAssigned') {
          this.groupAccess = true;
        }
        this.allowParticipantsJoiningMidActivity = g.allowParticipantsJoiningMidActivity;
        // this.unassignedUsers = g.unassignedParticipants;
      }
    });
  }

  updateGroupData(g: GroupingToolGroups) {
    this.selectedGrouping = g;
    if (g) {
      this.groupingTitle = g.title;
      this.allowParticipantsJoiningMidActivity = g.allowParticipantsJoiningMidActivity;
    }

    this.initUnassignedParticipants();

    this.initGroups(this.selectedGrouping);
  }

  initUnassignedParticipants() {
    const allUsers = this.activityState.lesson_run.participant_set;

    this.unassignedUsers = [];
    for (let j = 0; j < this.selectedGrouping.unassignedParticipants.length; j++) {
      const participantCode = this.selectedGrouping.unassignedParticipants[j];
      for (let k = 0; k < allUsers.length; k++) {
        const user = allUsers[k];
        if (user.participant_code === participantCode) {
          this.unassignedUsers.push(user);
          // allUsers.splice(k, 1);
        }
      }
    }
  }

  initGroups(selectedgrouping: GroupingToolGroups) {
    const allUsers = this.activityState.lesson_run.participant_set;
    this.breakoutRooms = [];

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
    this.sendMessage.emit(new EditGroupingTitleEvent(this.selectedGrouping.id, this.groupingTitle));
  }

  toggleChooseGroup($event) {
    this.sendMessage.emit(new AllowParticipantGroupingEvent($event.currentTarget.checked));
  }

  toggleChooseGroupMidActivity(event) {
    this.allowParticipantsJoiningMidActivity = event.currentTarget.checked;
    this.sendMessage.emit(new AllowParticipantGroupingMidActivityEvent(event.currentTarget.checked));
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
      this.sendMessage.emit(
        new GroupingAssignParticipantEvent(
          this.selectedGrouping.id,
          breakoutroomid,
          participant.participant_code
        )
      );
    }
  }

  addGroup() {
    const number = this.numberOfRooms + 1;
    const name = 'Room ' + number;
    this.numberOfRooms++;
    this.sendMessage.emit(new CreateGroupEvent(this.selectedGrouping.id, name));
  }

  makeActivityGrouping() {
    // check if at least one group has at least one participant
    if (this.activitiesService.groupingsValid(this.selectedGrouping)) {
      const activityID = this.activitiesService.getActivityID(this.activityState);
      const activityType = this.activitiesService.getActivityType(this.activityState);
      const code = activityID + this.activityState.lesson_run.lessonrun_code;
      window.localStorage.setItem('isGroupingCreated', code);
      if (activityType === 'casestudyactivity') {
        this.sendMessage.emit(new StartCaseStudyGroupEvent());
      } else if (activityType === 'brainstormactivity') {
        this.sendMessage.emit(new StartBrainstormGroupEvent(this.selectedGrouping.id));
      }
      this.showStartGroupingButton = false;
      this.sendMessage.emit(new ViewGroupingEvent(false));
    } else {
      this.utilsService.openWarningNotification('Add participants to the groups', '');
    }
  }

  changeGroupAccess(status) {
    if (status === 'close') {
      this.groupAccess = false;
      this.sendMessage.emit(new UpdateGroupingStyleEvent(this.selectedGrouping.id, 'hostAssigned'));
    } else if (status === 'open') {
      this.sendMessage.emit(new UpdateGroupingStyleEvent(this.selectedGrouping.id, 'selfAssigned'));
      this.groupAccess = true;
    }
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

  updateGroupsCount(value) {
    this.typingStartedGroups();
    if (value === '-') {
      if (this.groupsCount === 1) {
        return;
      } else {
        this.groupsCount--;
      }
    } else if (value === '+') {
      this.groupsCount++;
    }
    this.typingStopedGroups(this.groupsCount);
  }

  typingStopedGroups(noOfGroups) {
    clearTimeout(this.typingTimerGroups);
    this.typingTimerGroups = setTimeout(() => {
      this.doneTypingGroups(noOfGroups);
    }, 1500);
  }

  typingStartedGroups() {
    clearTimeout(this.typingTimerGroups);
  }

  doneTypingGroups(noOfGroups) {
    this.sendMessage.emit(new CreateGroupsEvent(this.selectedGrouping.id, noOfGroups));
  }

  getLessonActivities() {
    this.activities$ = this.backendRestService
      .getLessonRunActivities(this.activityState.lesson_run.lessonrun_code)
      .map((activities) => {
        const acts = [];
        activities.forEach((activity) => {
          if (
            activity.activity_type !== 'MCQResultsActivity' &&
            activity.activity_type !== 'LobbyActivity' &&
            activity.activity_type !== 'ExternalGroupingActivity' &&
            activity.activity_type !== 'PollResultsActivity'
          ) {
            if (activity.activity_type === this.at.brainStorm) {
              acts.push({ id: activity.id, name: activity.instructions });
            } else if (activity.activity_type === this.at.caseStudy) {
              acts.push({ id: activity.id, name: activity.activity_title });
            }
          }
        });
        return acts;
      });
  }
}

// participant grouping modal only opens up
// when the trainer selects self assigned in their groupin dialog
// all through out the grouping process the participants don't see the groups being made

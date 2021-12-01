import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { ActivitiesService, ContextService } from 'src/app/services';
import {
  BrainstormSubmissionCompleteInternalEvent,
  CreateGroupingEvent,
  DeleteGroupingEvent,
  SelectGroupingEvent,
  StartBrainstormGroupEvent,
  StartCaseStudyGroupEvent,
  Timer,
  UpdateMessage,
  ViewGroupingEvent,
} from 'src/app/services/backend/schema';
import { GroupingToolGroups } from 'src/app/services/backend/schema/course_details';
import { UtilsService } from 'src/app/services/utils.service';
import { GroupingToolDialogComponent } from 'src/app/shared/dialogs';

@Component({
  selector: 'benji-grouping-control',
  templateUrl: './grouping-control.component.html',
  styleUrls: [],
})
export class GroupingControlComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  existingGroupings: Array<GroupingToolGroups> = [];
  selectedGroup: GroupingToolGroups;
  groupingType = 'new';
  newGroupingTitle = '';
  dialogRef: MatDialogRef<GroupingToolDialogComponent>;

  // id of the grouping that is applied
  // to the current activity
  currentlyAppliedGrouping;

  @Output() socketMessage = new EventEmitter<any>();

  constructor(
    private contextService: ContextService,
    private utilsService: UtilsService,
    private matDialog: MatDialog,
    private activitiesService: ActivitiesService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.initExistingGroupins();

    this.initSelectedGroup();
  }

  initExistingGroupins() {
    const rt = this.activityState.running_tools;
    this.currentlyAppliedGrouping = this.getCurrentlyAppliedGrouping(this.activityState);

    if (rt && rt.grouping_tool) {
      const grouping = {
        groupings: this.activityState.running_tools.grouping_tool.groupings,
        selectedGrouping: this.activityState.running_tools.grouping_tool.selectedGrouping,
      };
      this.existingGroupings = grouping.groupings;
    }
  }

  getCurrentlyAppliedGrouping(state: UpdateMessage) {
    const activityType = this.activitiesService.getActivityType(this.activityState);
    if (this.activityState[activityType].grouping) {
      return this.activityState[activityType].grouping.id;
    } else {
      return null;
    }
  }

  initSelectedGroup() {
    const rt = this.activityState.running_tools;
    if (rt && rt.grouping_tool) {
      const grouping = {
        groupings: this.activityState.running_tools.grouping_tool.groupings,
        selectedGrouping: this.activityState.running_tools.grouping_tool.selectedGrouping,
      };
      grouping.groupings.forEach((g: GroupingToolGroups) => {
        if (grouping.selectedGrouping === g.id) {
          this.selectedGroup = g;
          if (this.dialogRef) {
            // if the trainer grouping dialog is open then update the data for it
            this.dialogRef.componentInstance.updateGroupData(this.selectedGroup);
          }
        }
      });
    }
  }

  editGrouping(grouping: GroupingToolGroups) {
    // open the grouping modal for the trainer and
    // send the SelectGroupingEvent for the clicked grouping.

    // it will trigger onChanges and send the updated information
    // to the open grouping modal.

    this.socketMessage.emit(new SelectGroupingEvent(grouping.id));
    const dialogRef = this.openGroupingToolDialog();
    this.selectedGroup = grouping;
    // this.socketMessage.emit(new ViewGroupingEvent(true));
  }

  addNewGrouping() {
    this.socketMessage.emit(new CreateGroupingEvent('Untitled Grouping'));
    this.openGroupingToolDialog();
    // this.socketMessage.emit(new ViewGroupingEvent(true));
  }

  deleteGroup(grouping) {
    this.socketMessage.emit(new DeleteGroupingEvent(grouping.id));
  }

  openGroupingToolDialog() {
    this.dialogRef = this.matDialog.open(GroupingToolDialogComponent, {
      panelClass: 'grouping-tool-dialog',
      data: {
        activityState: this.activityState,
      },
    });

    const sub = this.dialogRef.componentInstance.sendMessage.subscribe((event) => {
      this.socketMessage.emit(event);
    });

    this.dialogRef.afterClosed().subscribe((result) => {
      sub.unsubscribe();
      if (result === 'Use Template') {
      }
      console.log(`Dialog result: ${result}`);
    });
    return this.dialogRef;
  }

  startGrouping(grouping) {
    if (this.activitiesService.groupingsValid(grouping)) {
      const activityID = this.activitiesService.getActivityID(this.activityState);
      const activityType = this.activitiesService.getActivityType(this.activityState);
      const code = activityID + this.activityState.lesson_run.lessonrun_code;
      window.localStorage.setItem('isGroupingCreated', code);
      if (activityType === 'casestudyactivity') {
        this.socketMessage.emit(new StartCaseStudyGroupEvent(grouping.id));
      } else if (activityType === 'brainstormactivity') {
        this.socketMessage.emit(new StartBrainstormGroupEvent(grouping.id));
      }
      // this.socketMessage.emit(new ViewGroupingEvent(false));
    } else {
      this.utilsService.openWarningNotification('Add participants to the groups', '');
    }
  }
}

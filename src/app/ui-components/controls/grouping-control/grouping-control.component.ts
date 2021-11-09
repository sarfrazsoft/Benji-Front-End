import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { ContextService } from 'src/app/services';
import {
  BrainstormSubmissionCompleteInternalEvent,
  CreateGroupingEvent,
  SelectGroupingEvent,
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

  @Output() socketMessage = new EventEmitter<any>();

  constructor(
    private contextService: ContextService,
    private utilsService: UtilsService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.initExistingGroupins();

    this.initSelectedGroup();
  }

  initExistingGroupins() {
    const rt = this.activityState.running_tools;
    if (rt && rt.grouping_tool) {
      const grouping = {
        groupings: this.activityState.running_tools.grouping_tool.groupings,
        selectedGrouping: this.activityState.running_tools.grouping_tool.selectedGrouping,
      };
      this.existingGroupings = grouping.groupings;
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
            this.dialogRef.componentInstance.updateGroupData(this.selectedGroup);
          }
        }
      });
      // this.existingGroupings = grouping.groupings;
    }
  }

  editGrouping(grouping: GroupingToolGroups) {
    const dialogRef = this.openGroupingToolDialog();
    this.selectedGroup = grouping;
    dialogRef.componentInstance.updateGroupData(this.selectedGroup);
  }

  addNewGrouping() {
    this.socketMessage.emit(new CreateGroupingEvent('Untitled Grouping'));
    this.openGroupingToolDialog();
    this.socketMessage.emit(new ViewGroupingEvent(true));
  }

  selectExistingGrouping() {
    this.socketMessage.emit(new SelectGroupingEvent(this.selectedGroup.id));
    this.socketMessage.emit(new ViewGroupingEvent(true));
  }

  selectGrouping(event: GroupingToolGroups) {
    this.selectedGroup = event;
  }

  openGroupingToolDialog() {
    this.dialogRef = this.matDialog.open(GroupingToolDialogComponent, {
      width: '1168px',
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
}

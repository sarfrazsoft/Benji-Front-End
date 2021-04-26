import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'benji-grouping-control',
  templateUrl: './grouping-control.component.html',
  styleUrls: [],
})
export class GroupingControlComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  existingGroupings = [];
  selectedGroup;
  groupingType = 'new';
  newGroupingTitle = '';

  @Output() socketMessage = new EventEmitter<any>();

  constructor(private contextService: ContextService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.initExistingGroupins();
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

  start() {
    if (this.groupingType === 'new') {
      this.socketMessage.emit(new CreateGroupingEvent(this.newGroupingTitle));
    } else {
      this.socketMessage.emit(new SelectGroupingEvent(this.selectedGroup.id));
      this.socketMessage.emit(new ViewGroupingEvent(true));
    }
  }

  selectGrouping(event: GroupingToolGroups) {
    this.selectedGroup = event;
  }
}

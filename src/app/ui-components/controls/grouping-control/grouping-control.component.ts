import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { ContextService } from 'src/app/services';
import {
  BrainstormSubmissionCompleteInternalEvent,
  CreateGroupingEvent,
  SelectGroupingEvent,
  Timer,
  UpdateMessage,
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
  groupingType = 'existing';
  newGroupingTitle = '';

  @Output() socketMessage = new EventEmitter<any>();

  constructor(private contextService: ContextService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.initExistingGroupins();
  }

  initExistingGroupins() {
    const grouping = {
      groupings: this.activityState.running_tools.groupings,
      selectedGrouping: this.activityState.running_tools.selectedGrouping,
    };
    this.existingGroupings = grouping.groupings;
  }

  start() {
    this.socketMessage.emit(new CreateGroupingEvent(this.newGroupingTitle));
  }

  selectGrouping($event: GroupingToolGroups) {
    this.socketMessage.emit(new SelectGroupingEvent($event.id));
    console.log($event);
  }
}

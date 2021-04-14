import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { ContextService } from 'src/app/services';
import {
  BrainstormSubmissionCompleteInternalEvent,
  CreatGroupingEvent,
  Timer,
  UpdateMessage,
} from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-grouping-control',
  templateUrl: './grouping-control.component.html',
  styleUrls: [],
})
export class GroupingControlComponent implements OnInit {
  @Input() activityState: UpdateMessage;
  groupingType = 'existing';
  newGroupingTitle = '';

  @Output() socketMessage = new EventEmitter<any>();

  constructor(private contextService: ContextService) {}

  ngOnInit(): void {}

  start() {
    this.socketMessage.emit(new CreatGroupingEvent(this.newGroupingTitle));
  }
}

import {Input, Output, EventEmitter} from '@angular/core';
import {ActivityFlowServerMessage} from '../../../services/backend/schema/activity';

export abstract class BaseActivityComponent {
  @Input() activityState: ActivityFlowServerMessage;
  @Output() sendMessage = new EventEmitter<any>();

  public idToName(id: number) {
    return this.activityState.participants.find((user) => user.id === id).first_name;
  }
}

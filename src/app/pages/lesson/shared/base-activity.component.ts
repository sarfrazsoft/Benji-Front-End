import {Input, Output, EventEmitter} from '@angular/core';
import { UpdateMessage } from '../../../services/backend/schema/messages';
import { ActivityEvent } from '../../../services/backend/schema/messages';

export abstract class BaseActivityComponent {
  @Input() activityState: UpdateMessage;
  @Output() sendMessage = new EventEmitter<ActivityEvent>();

  public idToName(id: number) {
    return this.activityState.lesson_run.joined_users.find((user) => user.id === id).first_name;
  }
}

import { EventEmitter, Input, Output } from '@angular/core';
import {
  ActivityEvent,
  UpdateMessage
} from 'src/app/services/backend/schema/messages';

export abstract class BaseActivityComponent {
  @Input() activityState: UpdateMessage;
  @Input() avgServerTimeOffset: number;
  @Output() sendMessage = new EventEmitter<ActivityEvent>();

  // TODO remove idToName it is not being used anywhere
  public idToName(id: number) {
    return this.activityState.lesson_run.joined_users.find(
      user => user.id === id
    ).first_name;
  }

  public isEmoji(url: string) {
    return url.includes('emoji://');
  }
}

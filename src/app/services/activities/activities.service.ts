import { Injectable } from '@angular/core';
import { UpdateMessage } from '../backend/schema/messages';

@Injectable()
export class ActivitiesService {
  constructor() {}

  getParticipantName(activityState: UpdateMessage, code: number) {
    const host = activityState.lesson_run.host;
    let name = host.first_name + ' ' + host.last_name;
    if (host) {
      name = 'Facilitator';
    }
    if (host.first_name) {
      name = host.first_name;
    }
    if (host.last_name) {
      name = name + ' ' + host.last_name;
    }

    activityState.lesson_run.participant_set.forEach((p) => {
      if (p.participant_code === code) {
        name = p.display_name;
      }
    });
    return name;
  }

  getActivityID(activityState: UpdateMessage): string {
    const activity_type = activityState.activity_type.toLowerCase();
    const state = activityState;
    return state[activity_type].activity_id;
  }

  getActivityType(activityState: UpdateMessage): string {
    return activityState.activity_type.toLowerCase();
  }
}

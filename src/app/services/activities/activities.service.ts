import { Injectable } from '@angular/core';
import { GroupingToolGroups } from '../backend/schema/course_details';
import { UpdateMessage } from '../backend/schema/messages';

@Injectable()
export class ActivitiesService {
  constructor() {}

  getParticipantName(activityState: UpdateMessage, code: number) {
    const host = activityState.lesson_run?.host;
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

  groupingsValid(grouping: GroupingToolGroups): boolean {
    if (grouping.groups.length === 0) {
      return false;
    }
    let check = false;
    grouping.groups.forEach((room) => {
      // at least one group should have one person
      if (room.participants.length) {
        check = true;
      }
    });
    return check;
  }
}

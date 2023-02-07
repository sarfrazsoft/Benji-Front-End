import { Injectable } from '@angular/core';
import { GroupingToolGroups } from '../backend/schema/course_details';
import { UpdateMessage } from '../backend/schema/messages';

@Injectable()
export class ActivitiesService {
  constructor() {}

  getParticipantName(activityState: UpdateMessage, code: number) {
    if (!activityState || !activityState.lesson_run) {
      return undefined;
    }

    const lessonRun = activityState.lesson_run;
    let name;

    if (lessonRun.host) {
      const host = lessonRun.host;
      name = host.first_name || host.last_name ? `${host.first_name} ${host.last_name}` : 'Facilitator';
    }

    if (lessonRun.participant_set && code) {
      const participant = lessonRun.participant_set.find((p) => p.participant_code === code);
      if (participant) {
        name = participant.display_name;
      } else {
        name = 'John Doe';
      }
    }

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

import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Timer } from 'src/app/services/backend/schema';
import { Group } from 'src/app/services/backend/schema/activities/activities';
import { Participant } from 'src/app/services/backend/schema/course_details';
import {
  ActivityEvent,
  StartBrainstormGroupEvent,
  StartCaseStudyGroupEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema/messages';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class BaseActivityComponent implements OnInit {
  @Input() activityState: UpdateMessage;
  @Input() avgServerTimeOffset: number;
  @Input() actEditor = false;
  @Output() sendMessage = new EventEmitter<ActivityEvent>();
  timer;
  myParticipantCode: number;
  eventType;

  ngOnInit() {
    this.myParticipantCode = this.getParticipantCode();
    // this.eventType = this.getEventType();
  }

  getActivityType() {
    if (this.activityState.activity_type !== null) {
      return this.activityState.activity_type;
    } else {
      return null;
    }
  }

  // TODO remove idToName it is not being used anywhere
  public idToName(id: number) {
    return this.activityState.lesson_run.participant_set.find((user) => user.participant_code === id)
      .display_name;
  }

  public isEmoji(url: string) {
    if (url) {
      return url.includes('emoji://');
    }
  }

  public getParticipantCode(): number {
    let details: Participant;
    const lessonRunCode = this.activityState.lesson_run.lessonrun_code;
    if (localStorage.getItem('participant_' + lessonRunCode)) {
      details = JSON.parse(localStorage.getItem('participant_' + lessonRunCode));
      return details.participant_code;
    }
  }

  public getParticipantCodes(group: Group) {
    return group.participants;
  }

  public getParticipantName(code: number) {
    const host = this.activityState.lesson_run.host;
    let name = host.first_name + ' ' + host.last_name;
    if (host) {
      name = 'Facilitator';
    }
    if (host.fist_name) {
      name = host.first_name;
    }
    if (host.last_name) {
      name = name + ' ' + host.last_name;
    }

    this.activityState.lesson_run.participant_set.forEach((p) => {
      if (p.participant_code === code) {
        name = p.display_name;
      }
    });
    return name;
  }

  getNextActStartTimer(): Timer {
    const activity_type = this.activityState.activity_type.toLowerCase();
    return this.activityState[activity_type].next_activity_start_timer;
  }

  next_activity_delay_seconds(): number {
    const activity_type = this.activityState.activity_type.toLowerCase();
    return this.activityState[activity_type].next_activity_delay_seconds;
  }

  isLastActivity() {
    const activity_type = this.activityState.activity_type.toLowerCase();
    return !this.activityState[activity_type].next_activity;
  }

  getActiveParticipants() {
    return this.activityState.lesson_run.participant_set.filter((x) => x.is_active);
  }

  getIsSharing() {
    const sm = this.activityState;
    if (sm && sm.running_tools && sm.running_tools.share) {
      return true;
    } else {
      return false;
    }
  }

  getTimerTool() {
    const sm = this.activityState;
    if (sm && sm.running_tools && sm.running_tools.timer_tool) {
      return sm.running_tools.timer_tool;
    }
  }

  sendSocketMessage($event) {
    this.sendMessage.emit($event);
  }

  getEventType() {
    return this.activityState.eventType;
  }

  // getterEventType
  public get getterEventType(): string {
    return this.activityState.eventType;
  }
}

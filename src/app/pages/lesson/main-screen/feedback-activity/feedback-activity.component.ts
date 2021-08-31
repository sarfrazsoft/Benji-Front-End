import { Component, OnChanges, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-feedback-activity',
  templateUrl: './feedback-activity.component.html',
})
export class MainScreenFeedbackActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {
  title = '';
  title_emoji = '';
  instructions = '';
  answeredParticipantsLength = null;
  joinedUsers = [];
  answeredParticipants = [];
  unansweredParticipants = [];
  constructor() {
    super();
  }
  ngOnInit() {
    super.ngOnInit();
    this.changes();
  }

  changes() {
    const act = this.activityState.feedbackactivity;
    this.title_emoji = act.title_emoji ? act.title_emoji : '';
    if (act) {
      this.title = act.titlecomponent.title;
      this.instructions = act.titlecomponent.screen_instructions;
      this.answeredParticipantsLength = act.answered_participants.length;
      //this.participantsLength = this.activityState.lesson_run.participant_set.length;
    }
  }

  ngOnChanges() {
    this.loadUsersCounts();
    this.changes();
  }

  loadUsersCounts() {
    this.joinedUsers = [];
    this.answeredParticipants = [];
    this.unansweredParticipants = [];
    this.joinedUsers = this.getActiveParticipants();
    this.activityState.feedbackactivity.answered_participants.forEach((code) => {
      this.answeredParticipants.push(this.getParticipantName(code.participant_code));
    });
    this.unansweredParticipants = this.getUnAnsweredUsers();
  }

  getUnAnsweredUsers() {
    let answered = this.answeredParticipants;
    let active = [];
    for (let index = 0; index < this.joinedUsers.length; index++) {
      active.push(this.joinedUsers[index].display_name);
    }
    return (active.filter(name => !answered.includes(name)));
  }
}

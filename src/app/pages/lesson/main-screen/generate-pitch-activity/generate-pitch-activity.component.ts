import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';

import { EmojiLookupService } from 'src/app/services';
import {
  PitchoMaticActivity,
  PitchoMaticBlank
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-generate-pitch-activity',
  templateUrl: './generate-pitch-activity.component.html',
  styleUrls: ['./generate-pitch-activity.component.scss']
})
export class MainScreenGeneratePitchActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  @ViewChild('timer') timer;
  preparing = false;
  splitIntoGroups = false;
  timeToPitchLT8 = false;
  timeToPitchMT8 = false;
  giveFeedbackLT8 = false;
  giveFeedbackMT8 = false;
  shareFeedbackLT8 = false;
  shareFeedbackMT8 = false;

  userList1 = [
    { name: 'Omar', found: false },
    { name: 'Reagon', found: true },
    { name: 'Emily', found: false }
  ];
  userList2 = [
    { name: 'Polly', found: false },
    { name: 'Harold', found: false },
    { name: 'Marie-Ann', found: true }
  ];

  constructor(private emoji: EmojiLookupService) {
    super();
  }

  ngOnInit() {}

  ngOnChanges() {
    const state = this.activityState;
    if (state.pitchomaticactivity.activity_status === 'grouping') {
      this.preparing = false;
      if (state.pitchomaticactivity.pitchomaticgroup_set.length === 2) {
        if (!this.splitIntoGroups) {
          this.initTimer(state.pitchomaticactivity.group_timer.end_time);
        }
        this.splitIntoGroups = true;
      }
    } else if (state.pitchomaticactivity.activity_status === 'preparing') {
      if (this.splitIntoGroups) {
        this.timer.stopTimer();
      }
      this.splitIntoGroups = false;
      this.preparing = true;
    } else if (state.pitchomaticactivity.activity_status === 'pitching') {
      this.splitIntoGroups = false;
      this.preparing = false;
      this.giveFeedbackLT8 = false;
      this.giveFeedbackMT8 = false;
      if (state.pitchomaticactivity.pitchomaticgroup_set.length === 1) {
        this.shareFeedbackLT8 = false;
        this.timeToPitchLT8 = true;
      } else {
        this.shareFeedbackMT8 = false;
        this.timeToPitchMT8 = true;
        this.initTimer(state.pitchomaticactivity.pitch_timer.end_time);
      }
    } else if (state.pitchomaticactivity.activity_status === 'feedback') {
      if (state.pitchomaticactivity.pitchomaticgroup_set.length === 1) {
        this.timeToPitchLT8 = false;
        this.giveFeedbackLT8 = true;
      } else {
        this.timeToPitchMT8 = false;
        if (!this.giveFeedbackMT8) {
          this.initTimer(state.pitchomaticactivity.feedback_timer.end_time);
        }
        this.giveFeedbackMT8 = true;
      }
    } else if (state.pitchomaticactivity.activity_status === 'discussion') {
      if (state.pitchomaticactivity.pitchomaticgroup_set.length === 1) {
        this.timeToPitchLT8 = false;
        this.giveFeedbackLT8 = false;
        this.shareFeedbackLT8 = true;
      } else {
        this.timeToPitchMT8 = false;
        this.giveFeedbackMT8 = false;
        if (!this.shareFeedbackMT8) {
          this.initTimer(state.pitchomaticactivity.discuss_timer.end_time);
        }
        this.shareFeedbackMT8 = true;
      }
    }
  }

  initTimer(endTime: string) {
    this.timer.startTimer(0);
    const seconds = (Date.parse(endTime) - Date.now()) / 1000;
    this.timer.startTimer(seconds);
  }

  getSinglePitchingUserInfo() {
    const pitch_set = [];
    const act: PitchoMaticActivity = this.activityState.pitchomaticactivity;
    const blank_set: Array<PitchoMaticBlank> = act.pitchomaticblank_set;
    blank_set.sort((a, b) => a.order - b.order);

    let pitchInfo = '';
    const pitchingMember = act.pitchomaticgroup_set[0].pitchomaticgroupmember_set.filter(
      member => member.is_pitching
    )[0];

    blank_set.forEach(blank => {
      const choice = pitchingMember.pitch.pitchomaticgroupmemberpitchchoice_set.filter(
        el => {
          return el.pitchomaticblank === blank.id;
        }
      )[0].choice;

      const value = blank.pitchomaticblankchoice_set.filter(el => {
        return el.id === choice;
      })[0].value;

      pitch_set.push({
        id: blank.id,
        label: blank.label,
        order: blank.order,
        value: value
      });
    });

    pitchInfo =
      '<em>' +
      pitchingMember.user.first_name +
      '</em> is pitching ' +
      pitch_set[0].value +
      ' to ' +
      pitch_set[1].value +
      ' using ' +
      pitch_set[2].value;
    return pitchInfo;
  }

  getGroupedPitchingUserInfo(groupIndex) {
    const pitch_set = [];
    const act: PitchoMaticActivity = this.activityState.pitchomaticactivity;
    const blank_set: Array<PitchoMaticBlank> = act.pitchomaticblank_set;
    blank_set.sort((a, b) => a.order - b.order);

    let pitchInfo = '';
    const pitchingMember = act.pitchomaticgroup_set[
      groupIndex
    ].pitchomaticgroupmember_set.filter(member => member.is_pitching)[0];

    blank_set.forEach(blank => {
      const choice = pitchingMember.pitch.pitchomaticgroupmemberpitchchoice_set.filter(
        el => {
          return el.pitchomaticblank === blank.id;
        }
      )[0].choice;

      const value = blank.pitchomaticblankchoice_set.filter(el => {
        return el.id === choice;
      })[0].value;

      pitch_set.push({
        id: blank.id,
        label: blank.label,
        order: blank.order,
        value: value
      });
    });

    pitchInfo =
      '<em>' +
      pitchingMember.user.first_name.charAt(0).toUpperCase() +
      pitchingMember.user.first_name.slice(1) +
      '</em> is pitching ' +
      pitch_set[0].value +
      ' to ' +
      pitch_set[1].value +
      ' using ' +
      pitch_set[2].value;
    return pitchInfo;
  }

  getCurrentPitchingUser(groupIndex) {
    const act: PitchoMaticActivity = this.activityState.pitchomaticactivity;

    const pitchingMember = act.pitchomaticgroup_set[
      groupIndex
    ].pitchomaticgroupmember_set.filter(member => member.is_pitching)[0];
    const name = pitchingMember.user.first_name;
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  getGroupEmoji(groupIndex) {
    return this.activityState.pitchomaticactivity.pitchomaticgroup_set[
      groupIndex
    ].group_emoji;
  }

  getGroupMembers(groupIndex) {
    return this.activityState.pitchomaticactivity.pitchomaticgroup_set[
      groupIndex
    ].pitchomaticgroupmember_set;
  }

  getDiscussionStarterUser(groupIndex) {
    const act: PitchoMaticActivity = this.activityState.pitchomaticactivity;

    const pitchingMemberIndex = act.pitchomaticgroup_set[
      groupIndex
    ].pitchomaticgroupmember_set.findIndex(member => member.is_pitching);

    const groupSet =
      act.pitchomaticgroup_set[groupIndex].pitchomaticgroupmember_set;

    let randomPerson = '';
    let name = '';
    if (pitchingMemberIndex === 0) {
      // first person in the group is pitching
      name = groupSet[groupSet.length - 1].user.first_name;
    } else {
      name = groupSet[pitchingMemberIndex - 1].user.first_name;
    }
    randomPerson = name.charAt(0).toUpperCase() + name.slice(1);
    return randomPerson;
  }

  getFbackSubmittedCount(groupIndex) {
    const act: PitchoMaticActivity = this.activityState.pitchomaticactivity;
    const pitchingMember = act.pitchomaticgroup_set[
      groupIndex
    ].pitchomaticgroupmember_set.filter(member => member.is_pitching)[0];
    return pitchingMember.feedback_count;
  }

  getGroupUsersCount(groupIndex) {
    const act: PitchoMaticActivity = this.activityState.pitchomaticactivity;
    return act.pitchomaticgroup_set[groupIndex].pitchomaticgroupmember_set
      .length;
  }
}

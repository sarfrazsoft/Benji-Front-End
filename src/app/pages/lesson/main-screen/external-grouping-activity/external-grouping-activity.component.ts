import { Component, OnChanges, OnInit } from '@angular/core';
import {
  ExternalGroupingActivity,
  ExternalGroupingSubmitGroupEvent,
  User,
} from 'src/app/services/backend/schema';
import { Participant } from 'src/app/services/backend/schema/course_details';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-external-grouping-activity',
  templateUrl: './external-grouping-activity.component.html',
  styleUrls: ['./external-grouping-activity.component.scss'],
})
export class MainScreenExternalGroupingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  act: ExternalGroupingActivity;
  allUsers: Array<Participant>;
  breakoutRooms = [];
  // usersBreakoutRooms
  // length will be equal to joined users length
  // each index will contain the room id if it exists for that user
  usersBreakoutRooms = [];
  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.allUsers = this.activityState.lesson_run.participant_set;
    for (let i = 0, j = 1; i < this.allUsers.length; i = i + 2, j++) {
      this.breakoutRooms.push({ id: j, name: 'Room #' + j });
    }
  }

  ngOnChanges() {
    this.allUsers = this.activityState.lesson_run.participant_set;
    this.act = this.activityState.externalgroupingactivity;

    this.usersBreakoutRooms = [];
    for (let i = 0; i < this.allUsers.length; i = i + 1) {
      const user = this.allUsers[i];
      const roomId = this.getUserBreakoutRoom(user.participant_code);
      this.usersBreakoutRooms.push(roomId);
    }
  }

  getUserName(user: Participant) {
    return user.display_name;
  }

  getUserBreakoutRoom(userId: number) {
    // loop through all the rooms and user for each room
    for (let i = 0; i < this.act.group_set.length; i++) {
      const groupset = this.act.group_set[i];
      for (let j = 0; j < groupset.participantgroupstatus_set.length; j++) {
        // loop through each user in thr group comparing his id to userId
        // if it matches return the breakoutroomid
        const participantCode = groupset.participantgroupstatus_set[j].participant.participant_code;
        if (participantCode === userId) {
          return groupset.group_num;
        }
      }
    }

    return null;
  }

  assignRoom(room, user: Participant) {
    this.sendMessage.emit(new ExternalGroupingSubmitGroupEvent(room.id, user.participant_code));
  }
}

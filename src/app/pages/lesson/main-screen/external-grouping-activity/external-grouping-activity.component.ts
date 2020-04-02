import { Component, OnChanges, OnInit } from '@angular/core';
import {
  ExternalGroupingActivity,
  ExternalGroupingSubmitGroupEvent,
  User
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-external-grouping-activity',
  templateUrl: './external-grouping-activity.component.html',
  styleUrls: ['./external-grouping-activity.component.scss']
})
export class MainScreenExternalGroupingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  act: ExternalGroupingActivity;
  allUsers: Array<User>;
  breakoutRooms = [];
  // usersBreakoutRooms
  // length will be equal to joined users length
  // each index will contain the room id if it exists for that user
  usersBreakoutRooms = [];
  constructor() {
    super();
  }

  ngOnInit() {
    this.allUsers = this.activityState.lesson_run.joined_users;
    for (let i = 0, j = 1; i < this.allUsers.length; i = i + 2, j++) {
      this.breakoutRooms.push({ id: j, name: 'Room #' + j });
    }
  }

  ngOnChanges() {
    this.allUsers = this.activityState.lesson_run.joined_users;
    this.act = this.activityState.externalgroupingactivity;

    this.usersBreakoutRooms = [];
    for (let i = 0; i < this.allUsers.length; i = i + 1) {
      const user = this.allUsers[i];
      const roomId = this.getUserBreakoutRoom(user.id);
      this.usersBreakoutRooms.push(roomId);
    }
  }

  getUserBreakoutRoom(userId) {
    // loop through all the rooms and user for each room
    for (let i = 0; i < this.act.usergroup_set.length; i++) {
      const groupset = this.act.usergroup_set[i];
      for (let j = 0; j < groupset.usergroupuser_set.length; j++) {
        // loop through each user in thr group comparing his id to userId
        // if it matches return the breakoutroomid
        const user = groupset.usergroupuser_set[j].user;
        if (user.id === userId) {
          return groupset.group_num;
        }
      }
    }

    return null;
  }

  assignRoom(room, userId) {
    this.sendMessage.emit(
      new ExternalGroupingSubmitGroupEvent(room.id, userId)
    );
  }
}

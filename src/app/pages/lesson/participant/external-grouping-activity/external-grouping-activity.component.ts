import { Component, OnChanges, OnInit } from '@angular/core';
import {
  ExternalGroupingActivity,
  ExternalGroupingSubmitGroupEvent,
  User
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-external-grouping-activity',
  templateUrl: './external-grouping-activity.component.html',
  styleUrls: ['./external-grouping-activity.component.scss']
})
export class ParticipantExternalGroupingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  act: ExternalGroupingActivity;
  allUsers = [];
  breakoutRooms = [];
  selectedChoice = { id: null, name: null };
  choiceSubmitted = false;
  user: User;
  userRoomNumber;
  selectRoomModel = null;

  roomConfirmed = false;
  constructor() {
    super();
  }

  ngOnInit() {}

  ngOnChanges() {
    this.act = this.activityState.externalgroupingactivity;
    this.allUsers = this.activityState.lesson_run.joined_users;
    this.user = this.activityState.your_identity;
    this.userRoomNumber = this.getUserRoomNumber();
    // this.selectRoomModel = this.getUserRoomNumber();
    // check if the user is already grouped
    this.breakoutRooms = [];
    for (let i = 1, j = 1; i <= this.allUsers.length; i = i + 2, j++) {
      this.breakoutRooms.push({ id: j, name: 'Room #' + j });
    }
    if (this.askForRoomNumberStage()) {
    } else if (this.askForConfirmationStage()) {
    }
  }

  selectRoom(room) {
    this.selectedChoice = room;
  }

  submitChoice() {
    this.choiceSubmitted = true;
    this.sendMessage.emit(
      new ExternalGroupingSubmitGroupEvent(this.selectedChoice.id)
    );
  }

  askForRoomNumberStage() {
    // check if the user is already grouped
    return this.userRoomNumber ? false : true;
  }

  getUserRoomNumber() {
    for (let i = 0; i < this.act.usergroup_set.length; i++) {
      const groupset = this.act.usergroup_set[i];
      for (let j = 0; j < groupset.usergroupuser_set.length; j++) {
        // loop through each user in thr group comparing his id to userId
        // if it matches return the breakoutroomid
        const user = groupset.usergroupuser_set[j].user;
        if (user.id === this.user.id) {
          return groupset.group_num;
        }
      }
    }
    return null;
  }

  askForConfirmationStage() {
    return this.userRoomNumber ? true : false;
  }

  waitingForOthersStage() {
    return false;
  }

  confirmRoom() {
    this.roomConfirmed = true;
  }

  assignRoom(room) {
    this.sendMessage.emit(new ExternalGroupingSubmitGroupEvent(room.id));
    this.selectRoomModel = null;
  }
}

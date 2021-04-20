import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnChanges, OnInit } from '@angular/core';
import { ContextService } from 'src/app/services';
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
  collapsed = {};

  // new layout
  newLayout = true;
  constructor(private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.allUsers = this.activityState.lesson_run.participant_set;
    this.act = this.activityState.externalgroupingactivity;
    // this.contextService.activityTimer = this.act.grouping_countdown_timer;
    // Iterate over all the groups and add them to usersBreakoutRooms
    for (let i = 0; i < this.act.group_set.length; i++) {
      const groupset = this.act.group_set[i];
      const participants = [];
      for (let j = 0; j < groupset.participantgroupstatus_set.length; j++) {
        const groupUserList = groupset.participantgroupstatus_set[j];
        const participantCode = groupUserList.participant.participant_code;
        for (let k = 0; k < this.allUsers.length; k++) {
          const user = this.allUsers[k];
          if (user.participant_code === participantCode) {
            participants.push(user);
            this.allUsers.splice(k, 1);
          }
        }
      }
      this.breakoutRooms.push({
        id: groupset.group_num,
        name: 'Room #' + groupset.group_num,
        participants: participants,
      });
    }
    // for (let i = 0, j = 1; i < this.allUsers.length; i = i + 2, j++) {
    //   this.breakoutRooms.push({ id: j, name: 'Room #' + j, participants: [] });
    //   this.collapsed[j] = false;
    // }
  }

  addGroup() {
    const id = this.breakoutRooms.length + 1;
    this.breakoutRooms.push({ id: id, name: 'Room #' + id, participants: [] });
    this.collapsed[id] = false;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // this.sendCategorizeEvent(event);
      const participant: any = event.container.data[event.currentIndex];
      let breakoutroomid;
      this.breakoutRooms.forEach((b) => {
        b.participants.forEach((p) => {
          if (p.participant_code === participant.participant_code) {
            breakoutroomid = b.id;
          }
        });
      });
      this.assignRoom(breakoutroomid, participant.participant_code);
    }
  }

  ngOnChanges() {
    // this.allUsers = this.activityState.lesson_run.participant_set;
    this.act = this.activityState.externalgroupingactivity;

    // this.usersBreakoutRooms = [];
    // for (let i = 0; i < this.allUsers.length; i = i + 1) {
    //   const user = this.allUsers[i];
    //   const roomId = this.getUserBreakoutRoom(user.participant_code);
    //   this.usersBreakoutRooms.push(roomId);
    // }
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

  assignRoom(room, user) {
    this.sendMessage.emit(new ExternalGroupingSubmitGroupEvent(room, user));
  }
}

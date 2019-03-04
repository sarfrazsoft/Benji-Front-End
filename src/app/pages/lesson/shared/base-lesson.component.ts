import { ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';

import { forkJoin } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { BackendRestService } from '../../../services/backend/backend-rest.service';
import { BackendSocketService } from '../../../services/backend/backend-socket.service';

import {
  Course,
  Lesson,
  LessonRun
} from '../../../services/backend/schema/course_details';
import { User } from '../../../services/backend/schema/user';

import {
  ActivityEvent,
  ServerMessage,
  UpdateMessage
} from '../../../services/backend/schema/messages';

export class BaseLessonComponent implements OnInit, OnDestroy {
  roomCode: number;
  lessonRun: LessonRun;
  user: User;
  clientType: string;

  socket;
  serverMessage: UpdateMessage;

  constructor(
    protected restService: BackendRestService,
    protected route: ActivatedRoute,
    protected socketService: BackendSocketService,
    clientType: string,
    protected ref?: ChangeDetectorRef
  ) {
    this.roomCode = parseInt(this.route.snapshot.paramMap.get('roomCode'), 10);
    this.clientType = clientType;
  }

  ngOnInit() {
    // this.clientType = (this.route.snapshot.url.join('').includes('screen')) ? 'screen' : 'participant';

    forkJoin([
      this.restService.get_lessonrun(this.roomCode),
      this.restService.get_own_identity()
    ]).subscribe(([lessonRun, identity]) => {
      this.lessonRun = lessonRun;
      this.user = identity;
      this.socket = this.socketService.connectLessonSocket(
        this.clientType,
        this.lessonRun.lessonrun_code,
        this.user.id
      );
      console.log('socket connected');

      this.socket.subscribe((msg: ServerMessage) => {
        this.handleServerMessage(msg);
      });
    });
  }

  isConnected() {
    return this.socket !== undefined;
  }

  handleServerMessage(msg: ServerMessage) {
    if (msg.updatemessage !== null && msg.updatemessage !== undefined) {
      this.serverMessage = undefined;
      this.ref.detectChanges();
      this.serverMessage = Object.assign({}, msg.updatemessage);
    } else if (msg.clienterror !== null && msg.clienterror !== undefined) {
      console.log(msg);
    } else if (msg.servererror !== null && msg.servererror !== undefined) {
      console.log(msg);
    } else if (msg.servernotification !== null && msg.servernotification !== undefined) {
      console.log(msg);
    }
  }

  getActivityType() {
    if (this.serverMessage.activity_type !== null) {
      return this.serverMessage.activity_type;
    } else {
      return null;
    }
  }

  public sendSocketMessage(evt: ActivityEvent) {
    this.socket.next(evt.toMessage());
  }
}

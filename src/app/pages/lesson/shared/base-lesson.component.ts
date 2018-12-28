import { OnInit } from '@angular/core';

import { forkJoin } from 'rxjs';

import {BackendRestService} from '../../../services/backend/backend-rest.service';
import {ActivatedRoute} from '@angular/router';
import {BackendSocketService} from '../../../services/backend/backend-socket.service';

import { User } from '../../../services/backend/schema/user';
import { LessonRun } from '../../../services/backend/schema/course_details';
import {ActivityFlowFrame, ActivityFlowServerMessage} from '../../../services/backend/schema/activity';


export class BaseLessonComponent implements OnInit {
  roomCode: number;
  lessonRun: LessonRun;
  user: User;
  clientType: string;

  socket;
  serverMessage: ActivityFlowServerMessage;

  constructor(protected restService: BackendRestService, protected route: ActivatedRoute, protected socketService: BackendSocketService,
              clientType: string) {
    this.roomCode = parseInt(this.route.snapshot.paramMap.get('roomCode'), 10);
    this.clientType = clientType;
  }

  ngOnInit() {
    // this.clientType = (this.route.snapshot.url.join('').includes('screen')) ? 'screen' : 'participant';

    forkJoin([this.restService.get_lessonrun(this.roomCode), this.restService.get_own_identity()]).subscribe(
      ([lessonRun, identity]) => {
        this.lessonRun = lessonRun;
        this.user = identity;
        this.socket = this.socketService.getLessonSocket(this.clientType, this.lessonRun.id);

        this.socket.subscribe((msg: ActivityFlowFrame) => {
          this.handleServerMessage(msg);
        });
      }
    );
  }

  handleServerMessage(msg: ActivityFlowFrame) {
    this.serverMessage = msg.message;
  }

  getActivityType() {
    if (this.serverMessage.activity_status !== null || this.serverMessage.activity_status !== undefined) {
      return this.serverMessage.activity_status.activity_type;
    } else {
      return null;
    }
  }

  public sendSocketMessage(message) {
    this.socket.next(message);
  }

}

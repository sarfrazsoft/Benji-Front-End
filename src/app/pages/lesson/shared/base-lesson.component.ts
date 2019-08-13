import { ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BackendRestService } from 'src/app/services/backend/backend-rest.service';
import { BackendSocketService } from 'src/app/services/backend/backend-socket.service';
import {
  ActivityEvent,
  ServerMessage,
  UpdateMessage,
  User
} from 'src/app/services/backend/schema';
import {
  Course,
  Lesson,
  LessonRun
} from 'src/app/services/backend/schema/course_details';

export class BaseLessonComponent implements OnInit {
  roomCode: number;
  lessonRun: LessonRun;
  user: User;
  clientType: string;

  socket;
  serverMessage: UpdateMessage;
  serverOffsets: number[];
  avgServerTimeOffset: number;

  constructor(
    protected restService: BackendRestService,
    protected route: ActivatedRoute,
    protected socketService: BackendSocketService,
    clientType: string,
    protected ref?: ChangeDetectorRef
  ) {
    this.roomCode = parseInt(this.route.snapshot.paramMap.get('roomCode'), 10);
    this.clientType = clientType;
    this.avgServerTimeOffset = 0;
    this.serverOffsets = [];
  }

  ngOnInit() {
    this.initSocket();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // stop running expensive task
        this.socket = undefined;
        // console.log('hidden');
      } else {
        // page has focus, begin running task
        // console.log('shown');
        if (!this.isConnected()) {
          setTimeout(() => {
            this.initSocket();
          }, 500);
        }
      }
    });
  }

  initSocket() {
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
    // TODO show a loading spinner when notification_type = no_facilitator
    if (msg.updatemessage !== null && msg.updatemessage !== undefined) {
      if (
        this.serverMessage &&
        this.serverMessage.base_activity.activity_id !==
          msg.updatemessage.base_activity.activity_id
      ) {
        this.serverMessage = null;
        this.ref.detectChanges();
      }
      this.serverMessage = msg.updatemessage;
    } else if (msg.clienterror !== null && msg.clienterror !== undefined) {
      console.log(msg);
    } else if (msg.servererror !== null && msg.servererror !== undefined) {
      console.log(msg);
    } else if (
      msg.servernotification !== null &&
      msg.servernotification !== undefined
    ) {
      console.log(msg);
    }
    if (msg.messagetime !== null && msg.updatemessage !== undefined) {
      this.serverOffsets.push(msg.messagetime - Date.now());
      if (this.serverOffsets.length > 10) {
        this.serverOffsets.shift();
      }
      this.avgServerTimeOffset =
        this.serverOffsets.reduce(function(a, b) {
          return a + b;
        }) / this.serverOffsets.length;
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

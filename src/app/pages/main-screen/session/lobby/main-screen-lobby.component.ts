import {Component, Input, Output, OnInit, OnDestroy, ViewEncapsulation, EventEmitter} from '@angular/core';
import {BaseActivityComponent} from '../../../shared/base-activity.component';
import { WebSocketService } from '../../../../services/socket.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mainscreen-lobby',
  templateUrl: './main-screen-lobby.component.html',
  styleUrls: ['./main-screen-lobby.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MainScreenLobbyComponent implements OnInit, OnDestroy {
  // @Input() joinedUsers;
  @Output() activityComplete = new EventEmitter();
  public lessonTitle: string;
  public lessonDescription: string;
  @Input() roomCode: string;
  @Input() joinedUsers;
  public socketData$: Observable<any>;
  public socketSubscription;
  public lessonId;



  constructor(private socket: WebSocketService, private route: ActivatedRoute) {


    const mockData = {
      "type": "client_event",
      "message": {
        "course": "Test Course",
        "lesson": "Test Lesson",
        "lesson_title": "Active Listening",
        "lesson_description": "Over the next 45 minutes, we’ll learn and practice how to be better active listeners.",
        "room_code": "495137",
        "lesson_run_id": 1,
        "participants": [{
          "id": 2,
          "password": "",
          "last_login": null,
          "is_superuser": false,
          "username": "matt",
          "first_name": "Matt",
          "last_name": "Parson",
          "email": "matt@mybenji.com",
          "is_staff": false,
          "is_active": true,
          "date_joined": "2018-09-23T18:11:58.145000-04:00",
          "local_admin_permission": false,
          "participant_permission": true,
          "client": null,
          "groups": [],
          "user_permissions": []
        },
        {
          "id": 2,
          "password": "",
          "last_login": null,
          "is_superuser": false,
          "username": "matt",
          "first_name": "Andrew",
          "last_name": "Thompson",
          "email": "matt@mybenji.com",
          "is_staff": false,
          "is_active": true,
          "date_joined": "2018-09-23T18:11:58.145000-04:00",
          "local_admin_permission": false,
          "participant_permission": true,
          "client": null,
          "groups": [],
          "user_permissions": []
        }],
        "activity_status": {
          "activity_type": "LobbyActivity",
          "activity_id": "main_lobby",
          "title": "Waiting for your peers to join",
          "countdown_time": null
        }
      }
    };

    // this.socket.createSocketConnection('1', 'screen').then((sd: any) => {
    //   sd.subscribe((data) => {
    //     console.log(data);
    //     const _participants = [];
    //     data.message.participants.forEach((participant) => {
    //       _participants.push(participant.first_name);
    //     });
    //     this.joinedUsers = _participants;

    //     this.roomCode = data.message.lesson_run.lessonrun_code;






    //   });
    // });
  }

  ngOnInit() {
    // this.lessonId = this.route.snapshot.paramMap.get('lessonId');
    // this.socketSubscription = this.socketData$.pipe(
    //   tap((data: any) => {
    //     const _participants = [];
    //     data.message.participants.forEach((participant) => {
    //       _participants.push(participant.first_name);
    //     });
    //     this.joinedUsers = _participants;
    //     console.log(this.joinedUsers);
    //   })
    // ).subscribe((data: any) => {
    //   // this.lessonTitle = data.message.lesson_title;
    //   // this.lessonDescription = data.message.lesson_description;
    //   console.log(data);
    //   this.roomCode = data.message.lesson_run.lessonrun_code;
    // });
  }

  ngOnDestroy() {
  }


  kickOffLesson() {
    this.activityComplete.emit(true);
    this.socket.sendSocketEventMessage('end');
  }
}

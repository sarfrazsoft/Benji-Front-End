import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/socket.service';
import { BackendService } from 'src/app/services/backend.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-participant-lesson',
  templateUrl: './participant-lesson.component.html',
  styleUrls: ['./participant-lesson.component.scss']
})
export class ParticipantLessonComponent implements OnInit {
  constructor(
    private socket: WebSocketService,
    private backend: BackendService,
    private route: ActivatedRoute
  ) {}

  public socketData;
  public identity;
  public roomCode;
  public currentActivity;

  ngOnInit() {
    this.backend.get_own_identity().subscribe(identity => {
      this.identity = identity;
      console.log(identity);
      this.connectToLesson(this.identity.id);
    });
  }

  public sendSocketMessage(message) {
    this.socket.sendSocketFullMessage(message);
  }


  private connectToLesson(userId) {
    this.roomCode = this.route.snapshot.paramMap.get('roomCode');
    this.socket
      .createSocketConnection('participant', null, this.roomCode, userId)
      .subscribe(sd => {
        this.updateSocketData(sd);
        this.activityRender(sd.message.activity_status);

      });
  }

  private updateSocketData(data) {
    this.socketData = data;
    console.log(this.socketData);
  }

  private activityRender(activityStatus) {
    if(activityStatus.end === undefined) {
      switch (activityStatus.activity_type) {
        case 'LobbyActivity':
          this.currentActivity = 'lobbyActivity';
          break;
        case 'BrokenTelephoneActivity':
          this.currentActivity = 'teletrivia';
          break;
        case 'VideoActivity':
          this.currentActivity = 'videoActivity';
          break;
        case 'RoleplayPairActivity':
        case 'ReverseRoleplayPairActivity':
        this.currentActivity = 'pairActivity';
          break;
        case 'RoleplayPairShareActivity':
        this.currentActivity = 'discussionActivity';
          break;
        case 'WordVotingActivity':
        this.currentActivity = 'hintWordActivity';
          break;
        default:
      }

    } else {
      this.currentActivity = 'feedbackActivity';
    }
  }

}

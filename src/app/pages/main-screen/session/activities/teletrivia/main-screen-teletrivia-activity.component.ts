import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges
} from "@angular/core";
import { BaseActivityComponent } from "../../../../shared/base-activity.component";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { WebSocketService } from "../../../../../services/socket.service";

@Component({
  selector: "app-mainscreen-activity-teletrivia",
  templateUrl: "./main-screen-teletrivia-activity.component.html",
  styleUrls: ["./main-screen-teletrivia-activity.component.scss"]
})
export class MainScreenTeletriviaActivityComponent
  implements OnInit, OnDestroy, OnChanges {
  public leadersReady: boolean;
  public leaderBoardUsers = [];
  public gameOver: boolean;

  @Input() leaders;
  @Input() joinedUsers;
  @Input() data;


  public mockWsObject = {
    joinedUsers: [
      {
        userId: 1,
        name: "Andrew"
      },
      {
        userId: 2,
        name: "Scott"
      },
      {
        userId: 3,
        name: "Matt"
      },
      {
        userId: 4,
        name: "Amy"
      },
      {
        userId: 5,
        name: "Sean"
      }
    ],
    leaders: [
      {
        userId: 2,
        score: 15
      },
      {
        userId: 3,
        score: 14
      },
      {
        userId: 1,
        score: 10
      },
      {
        userId: 4,
        score: 9
      },
      {
        userId: 5,
        score: 9
      }
    ]
  };

  constructor(private socket: WebSocketService) {
    // this.getLeaders();

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentLeaders: SimpleChange = changes.leaders;
    if (currentLeaders.currentValue && this.leaders.length) {
      this.leadersReady = true;
      this.getLeaders();
    }
  }

  public getLeaders() {
    const joinedUsers = this.data.message.participants;
    // console.log(joinedUsers);
    const leaders = this.leaders;
    // console.log(leaders);
    const _leaderBoardUsers = [];

    leaders.forEach(leader => {
      const userLeader = joinedUsers.find(user => {
        console.log(leader.user);
        console.log(user.id);
        return user.id === leader.user;
      });
      console.log(userLeader);
      _leaderBoardUsers.push({
        name: userLeader.first_name,
        score: leader.correct
      });

      // console.log(this.leaderBoardUsers);
    });
    this.leaderBoardUsers = _leaderBoardUsers;
  }

  ngOnDestroy() {}

  end() {
    this.socket.sendSocketEventMessage('end');
  }
}

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
import { Observable, interval } from "rxjs";
import { map, share, tap, takeWhile } from "rxjs/operators";
import { WebSocketService } from "../../../../../services/socket.service";

@Component({
  selector: "app-mainscreen-activity-teletrivia",
  templateUrl: "./main-screen-teletrivia-activity.component.html",
  styleUrls: ["./main-screen-teletrivia-activity.component.scss"]
})
export class MainScreenTeletriviaActivityComponent
  implements OnInit, OnDestroy {
  public leaderBoardUsers = [];
  public gameOver: boolean;
  public makingCircle = true;
  public totalSeconds;
  public secondsElapsed = 0;
  private secondsElapsedInterval;
  private intervalSubscription;
  public _data;
  public _leaders;

  @Input() set data(data) {
    this._data = data;
    if (data.message.activity_status.all_in_circle) {
      // this.intervalSubscription.unsubscribe();
      this.makingCircle = false;
    }
  }
  @Input() set leaders(leaderArray) {
    console.log(`Input leaders array ${leaderArray}`);
    this._leaders = leaderArray;
    if (this._leaders !== undefined) {
      this.getLeaders();
    }
  }
  @Input() joinedUsers;
  @Input() set circleTimer(dateTimeString) {
    this.setupTimer(dateTimeString);
    this.intervalSubscription.subscribe((time) => {
      this.secondsElapsed = time;
    });
  }



  constructor(private socket: WebSocketService) {
    // this.getLeaders();

  }

  ngOnInit() {
  }



  public getLeaders() {
    const joinedUsers = this._data.message.participants;
    // console.log(joinedUsers);
    const leaders = this._leaders;
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

  private setupTimer(timer) {
    const countdown = Date.parse(timer) - Date.now();
    this.totalSeconds = countdown / 1000;
    this.secondsElapsed = 0;
    this.secondsElapsedInterval = interval(100);
    this.intervalSubscription = this.secondsElapsedInterval.pipe(
      share(),
      tap( (time: number) => {
        if (time / 10 >= this.totalSeconds) {
          this.makingCircle = false;
        }
      }),
      takeWhile((time: number) => time / 10 < this.totalSeconds),
      takeWhile(() => this.makingCircle)
    );
  }

  ngOnDestroy() {}

  end() {
    this.socket.sendSocketEventMessage('end');
  }
}

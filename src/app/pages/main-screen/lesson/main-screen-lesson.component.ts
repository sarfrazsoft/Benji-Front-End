import {
  Component,
  OnInit,
  Renderer2,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { WebSocketService } from "../../../services/socket.service";
import { Observable } from "rxjs";
import { BackendService } from "../../../services/backend.service";
import { WebSocketSubject } from "rxjs/webSocket";

@Component({
  selector: "app-main-screen-lesson",
  templateUrl: "./main-screen-lesson.component.html",
  styleUrls: ["./main-screen-lesson.component.scss"]
})
export class MainScreenLessonComponent implements OnInit, OnChanges {
  private lessonId;
  public socketData: any;
  public activityLoading;
  private clientType: string;
  public currentActivity: string;
  public roomCode;
  public participants;

  public showMainFooter;
  public showVideoControls;

  public gameStarted: boolean;
  public leaders;

  public userPairs;
  public pairGameStarted;
  public pairParticipants;
  public pairCountdownTime;
  public foundPairs;
  public allPairsFound;
  public pairGameReversed;

  @ViewChild("layoutContainer")
  public container: ElementRef;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private socket: WebSocketService,
    private backend: BackendService,
    private renderer: Renderer2
  ) {
    this.lessonId = this.route.snapshot.paramMap.get("lessonId");
    this.clientType = "screen";
  }

  ngOnInit() {
    this.auth
      .login("sean", "test")
      .subscribe(
        null,
        err => console.error(`Error on authentication: ${err}`),
        () => this.startLesson(this.lessonId)
      );
    this.handleFooterLayoutChange(this.showMainFooter);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.showMainFooter.currentValue !==
      changes.showMainFooter.previousValue
    ) {
      this.handleFooterLayoutChange(this.showMainFooter);
    }
  }

  private startLesson(lessonId) {
    // create course run first
    this.backend.createCourserun().subscribe((data: any) => {
      this.backend.startLesson(this.lessonId, data.id).subscribe(() => {
        // tell service to subscribe
        this.socket
          .createSocketConnection(this.clientType, this.lessonId)
          .subscribe((sd: any) => {
            console.log("new socket data...firing renderer");
            this.updateSocketData(sd);
            this.activityRender(sd.message.activity_status);
          });
      });
    });
  }

  private updateSocketData(data) {
    this.socketData = data;
    console.log(this.socketData);
  }

  private activityRender(activityStatus) {
    console.log("Checking Activity type...");
    switch (activityStatus.activity_type) {
      case "LobbyActivity":
        this.updateLobbyActivity();
        break;
      case "BrokenTelephoneActivity":
        this.updateTeletriviaActivity();
        break;
      case "VideoActivity":
        this.updateVideoActivity();
        break;
      case "RoleplayPairActivity":
      case "ReverseRoleplayPairActivity":
        console.log("pair activity");
        console.log(activityStatus);
        this.updatePairActivity(activityStatus.activity_type);
        break;
      case "RoleplayPairShareActivity":
        this.updateDiscussionActivity();
        break;
      default:
    }
  }

  private retrieveParticipants(participants) {
    const _participants = [];
    participants.forEach(participant => {
      _participants.push(participant.first_name);
    });
    return _participants;
  }

  private getLesson(client, lessonId) {
    return this.socket.getLessonSocket(client, lessonId);
  }

  public startNextActivity() {
    this.activityLoading = true;
  }

  private updateLobbyActivity() {
    this.participants = this.retrieveParticipants(
      this.socketData.message.participants
    );
    this.roomCode = this.socketData.message.lesson_run.lessonrun_code;
    this.showMainFooter = false;
    this.activityLoading = false;
    this.currentActivity = "lobbyActivity";
  }

  private updateTeletriviaActivity() {
    this.currentActivity = "teletrivia";
    this.activityLoading = false;
    this.showMainFooter = true;
    this.showVideoControls = false;
    this.roomCode = this.socketData.message.lesson_run.lessonrun_code;
    this.handleFooterLayoutChange(this.showMainFooter);
    this.sendLeaderBoard();
  }

  private updateVideoActivity() {
    this.currentActivity = "videoActivity";
    this.activityLoading = false;
    this.showMainFooter = true;
    this.showVideoControls = true;
    this.roomCode = this.socketData.message.lesson_run.lessonrun_code;
    this.handleFooterLayoutChange(this.showMainFooter);
  }

  private updatePairActivity(pairActivityType) {
    this.currentActivity = "pairActivity";
    this.activityLoading = false;
    this.showMainFooter = true;
    this.pairGameStarted = false;
    this.showVideoControls = false;
    this.handleFooterLayoutChange(this.showMainFooter);
    this.sendPairData(pairActivityType);
  }

  private updateDiscussionActivity() {
    this.currentActivity ="discussionActivity";
    this.activityLoading = false;
    this.roomCode = this.socketData.message.lesson_run.lessonrun_code;
    this.showMainFooter = true;
    this.showVideoControls = false;
    this.handleFooterLayoutChange(this.showMainFooter);
  }

  private sendLeaderBoard() {
    const leaderArray = this.socketData.message.activity_status.leaderboard;
    // check the leader board participants
    const leaders = [];
    if (leaderArray !== null && leaderArray["0"].correct > 0) {
      for (let i = 0; i < 6 && i < leaderArray.length; i++) {
        leaders.push(leaderArray[i]);
      }
    }
    this.leaders = leaders;
  }

  private sendPairData(pairActivityType) {
    this.userPairs = this.socketData.message.activity_status.user_groups;
    this.pairParticipants = this.socketData.message.participants;
    const countdownTime = this.socketData.message.activity_status
      .countdown_pair;
    this.pairCountdownTime = Date.parse(countdownTime);
    this.foundPairs = this.socketData.message.activity_status.user_pairs_found;
    this.allPairsFound = this.socketData.message.activity_status.all_pairs_found;
    console.log(this.allPairsFound);
    if (pairActivityType === "ReverseRoleplayPairActivity") {
      console.log(`it is reverse roleplay`);
      this.pairGameReversed = true;
    } else {
      console.log(`it is not reverse roleplay`);
      this.pairGameReversed = false;
    }
  }

  // private routeToActivity(activityStatus: ActivityStatus) {
  //   switch (activityStatus.activity_type) {
  //     case 'LobbyActivity':
  //       console.log('Routing to lobby');
  //       this.router.navigate(['lobby'], {relativeTo: this.route});
  //       break;
  //     case 'Papayas':
  //       console.log('');
  //       break;
  //     default:
  //       console.error(`Sorry the activity type of ${activityStatus.activity_type} does not have a corresponding component to route to!`);
  //   }
  // }

  private handleFooterLayoutChange(showFooter: boolean) {
    if (showFooter) {
      this.renderer.removeClass(
        this.container.nativeElement,
        "ms-lesson__activity-container--lobby"
      );
    } else if (!showFooter) {
      this.renderer.addClass(
        this.container.nativeElement,
        "ms-lesson__activity-container--lobby"
      );
    }
  }
}

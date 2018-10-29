import { Component, OnInit } from "@angular/core";
import { WebSocketService } from "src/app/services/socket.service";

@Component({
  selector: "app-participant-lesson",
  templateUrl: "./participant-lesson.component.html",
  styleUrls: ["./participant-lesson.component.scss"]
})
export class ParticipantLessonComponent implements OnInit {
  constructor(private socket: WebSocketService) {}

  public socketData;
  public identity;

  ngOnInit() {
    this.socket.createSocketConnection().subscribe(sd => {
      this.updateSocketData(sd);
      // this.activityRender(sd.message.activity_status);
    });
  }

  private updateSocketData(data) {
    this.socketData = data;
    console.log(this.socketData);
  }

  // private activityRender(activityStatus) {
  //   console.log("Checking Activity type...");
  //   switch (activityStatus.activity_type) {
  //     case "LobbyActivity":
  //       this.updateLobbyActivity();
  //       break;
  //     case "BrokenTelephoneActivity":
  //       this.updateTeletriviaActivity();
  //       break;
  //     case "VideoActivity":
  //       this.updateVideoActivity();
  //       break;
  //     case "RoleplayPairActivity":
  //     case "ReverseRoleplayPairActivity":
  //       console.log("pair activity");
  //       console.log(activityStatus);
  //       this.updatePairActivity(activityStatus.activity_type);
  //       break;
  //     case "RoleplayPairShareActivity":
  //       this.updateDiscussionActivity();
  //       break;
  //     default:
  //   }
  // }
}

import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import * as ons from "onsenui";
import { FormControl, Validators, AbstractControl } from "@angular/forms";
import { BackendService } from "../../../services/backend.service";
import { Router } from "@angular/router";

import { AuthService } from "../../../services/auth.service";
import { WebSocketService } from "src/app/services/socket.service";
import { HttpResponse } from "@angular/common/http";
import { webSocket } from "rxjs/webSocket";


@Component({
  selector: "app-participant-join",
  templateUrl: "./participant-join.component.html",
  styleUrls: ["./participant-join.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ParticipantJoinComponent implements OnInit {
  public isRoomCodeValid: boolean;
  public userName: string;

  public roomCode = new FormControl(null, [
    Validators.required,
    Validators.min(4)
  ]);

  constructor(
    private router: Router,
    private backend: BackendService,
    private socket: WebSocketService
  ) {}

  ngOnInit() {
    if (!this.userName) {
      this.backend.get_own_identity().subscribe(res => {
        this.userName = res.first_name;
      });
    }
  }

  public validateRoomCode() {
    this.backend.getLessonLink(this.roomCode.value).subscribe(
      (res: any) => {
        if (res.websocket_link) {
          this.socket.setSubjectOnJoin(res.websocket_link);
          this.isRoomCodeValid = true;
        }
      },
      err => {
        console.error(`Unable to join: ${err.error.error}`);
        this.isRoomCodeValid = false;
      }
    );
  }

  formSubmit() {
    this.router.navigate([`/participant/lesson/${this.roomCode.value}`]);
  }
}

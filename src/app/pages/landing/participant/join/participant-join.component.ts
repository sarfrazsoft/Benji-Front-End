import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { BackendRestService } from '../../../../services/backend/backend-rest.service';
import { BackendSocketService } from '../../../../services/backend/backend-socket.service';

import { Router } from '@angular/router';

@Component({
  selector: 'benji-participant-join',
  templateUrl: './participant-join.component.html',
  styleUrls: ['./participant-join.component.scss'],
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
    private backend: BackendRestService,
    private socket: BackendSocketService
  ) {}

  ngOnInit() {
    if (!this.userName) {
      this.backend.get_own_identity().subscribe(
        res => {
          this.userName = res.first_name;
        },
        err => {
          this.router.navigate([`/login`]);
        }
      );
    }
  }

  public validateRoomCode() {
    this.backend.getLessonLink(this.roomCode.value).subscribe(
      (res: any) => {
        if (res.websocket_link) {
          this.isRoomCodeValid = true;
          this.router.navigate([`/participant/lesson/${this.roomCode.value}`]);
        }
      },
      err => {
        console.error(`Unable to join: ${err.error.error}`);
        this.isRoomCodeValid = false;
      }
    );
  }

  /*formSubmit() {
    this.router.navigate([`/participant/lesson/${this.roomCode.value}`]);
  }*/
}

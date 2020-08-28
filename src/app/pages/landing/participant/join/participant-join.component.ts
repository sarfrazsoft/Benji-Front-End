import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BackendRestService, BackendSocketService } from 'src/app/services';
import { LessonRunDetails } from 'src/app/services/backend/backend-rest.service';

@Component({
  selector: 'benji-participant-join',
  templateUrl: './participant-join.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantJoinComponent implements OnInit {
  public isRoomCodeValid: boolean;
  public userName: string;

  public roomCode = new FormControl(null, [Validators.required, Validators.min(4)]);

  constructor(
    private router: Router,
    private backend: BackendRestService,
    private socket: BackendSocketService
  ) {}

  ngOnInit() {
    // if (!this.userName) {
    //   this.backend.get_own_identity().subscribe(
    //     res => {
    //       this.userName = res.first_name;
    //     },
    //     err => {
    //       this.router.navigate([`/login`]);
    //     }
    //   );
    // }
  }

  public validateRoomCode() {
    this.backend.validateRoomCode(this.roomCode.value).subscribe(
      (res: LessonRunDetails) => {
        this.backend.userEnteredroomCode = this.roomCode.value;
        localStorage.setItem('lessonRunDetails', JSON.stringify(res));
        this.isRoomCodeValid = true;
        this.router.navigate([`/participant/login`]);
      },
      (err) => {
        console.error(`Unable to join: ${err.error.error}`);
        this.isRoomCodeValid = false;
      }
    );
  }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, BackendRestService, BackendSocketService } from 'src/app/services';
import { LessonRunDetails, Participant } from 'src/app/services/backend/schema/course_details';

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
    private socket: BackendSocketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.userName) {
      this.backend.get_own_identity().subscribe(
        (res) => {
          // console.log(res);
          this.userName = res.first_name;
        },
        (err) => {
          // this.router.navigate([`/login`]);
        }
      );
    }
  }

  public validateRoomCode() {
    this.backend.validateRoomCode(this.roomCode.value).subscribe(
      (res: LessonRunDetails) => {
        this.backend.userEnteredroomCode = this.roomCode.value;
        const lessonrun_code = res.lessonrun_code;
        localStorage.setItem('lessonRunDetails', JSON.stringify(res));
        this.isRoomCodeValid = true;
        if (this.authService.isLoggedIn()) {
          this.backend.createUser(this.userName, lessonrun_code).subscribe((participant: Participant) => {
            if (res.lessonrun_code) {
              localStorage.setItem('participant', JSON.stringify(participant));
              this.router.navigate([`/participant/lesson/${res.lessonrun_code}`]);
            }
          });
        } else {
          this.router.navigate([`/participant/login`]);
        }
      },
      (err) => {
        console.error(`Unable to join: ${err.error.error}`);
        this.isRoomCodeValid = false;
      }
    );
  }
}

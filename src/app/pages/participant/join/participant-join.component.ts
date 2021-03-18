import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, BackendRestService, BackendSocketService } from 'src/app/services';
import { LessonRunDetails, Participant } from 'src/app/services/backend/schema/course_details';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'benji-participant-join',
  templateUrl: './participant-join.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantJoinComponent implements OnInit {
  public isRoomCodeValid = true;
  public userName: string;
  public loginError;
  public isInformationValid = false;
  public typingTimer;
  public lessonRunDetails: LessonRunDetails;

  tokenCleared = false;

  public roomCode = new FormControl(null, [Validators.required, Validators.min(4)]);
  public username = new FormControl(null, [Validators.required]);

  constructor(
    public router: Router,
    private backend: BackendRestService,
    private socket: BackendSocketService,
    private authService: AuthService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.username.disable();
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
        this.username.enable();
        // if (this.authService.isLoggedIn()) {
        //   this.backend
        //     .createParticipant(this.userName, lessonrun_code)
        //     .subscribe((participant: Participant) => {
        //       if (res.lessonrun_code) {
        //         localStorage.setItem('participant', JSON.stringify(participant));
        //         this.router.navigate([`/participant/lesson/${res.lessonrun_code}`]);
        //       }
        //     });
        // } else {
        // this.router.navigate([`/participant/login`]);
        // }
      },
      (err) => {
        console.error(`Unable to join: ${err.error.error}`);
        console.log(err);
        if (err.error.code === 'token_not_valid' && !this.tokenCleared) {
          localStorage.removeItem('token');
          this.tokenCleared = true;
          this.validateRoomCode();
        }
        this.isRoomCodeValid = false;
      }
    );
  }

  isNameValid() {
    if (this.username.valid) {
      return true;
    } else {
      return false;
    }
  }

  public createUser() {
    if (localStorage.getItem('lessonRunDetails')) {
      this.lessonRunDetails = JSON.parse(localStorage.getItem('lessonRunDetails'));
    } else {
      return false;
    }
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
    }

    if (!isNaN(this.username.value)) {
      this.loginError = true;
      return false;
    }

    this.backend.createParticipant(this.username.value, this.lessonRunDetails.lessonrun_code).subscribe(
      (res: Participant) => {
        this.loginError = false;
        if (res.lessonrun_code) {
          localStorage.setItem('participant', JSON.stringify(res));
          this.router.navigate([`/participant/lesson/${res.lessonrun_code}`]);
        } else {
          this.loginError = true;
        }
      },
      (err) => {
        console.log(err);
        if (err && err.error && err.error.non_field_errors) {
          if (err.error.non_field_errors[0] === 'A participant with that display name already exists') {
            console.log('err');
            this.utilsService.showWarning(
              'A participant with that name has already joined. Try a different name.'
            );
          }
        }
      }
    );
  }

  typingStoped(event) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.doneTyping();
    }, 1000);
  }
  typingStarted() {
    clearTimeout(this.typingTimer);
  }

  doneTyping() {
    this.validateRoomCode();
  }
}

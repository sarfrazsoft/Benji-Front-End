import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BackendRestService } from 'src/app/services';
import * as global from 'src/app/globals';
import { HttpClient } from "@angular/common/http";
import { BeforeLessonRunDetails, LessonRunDetails } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-participant-join',
  templateUrl: './participant-join.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantJoinComponent implements OnInit {
  public isRoomCodeValid = true;
  public userName: string;
  public beforeLessonRunDetails: BeforeLessonRunDetails;

  tokenCleared = false;

  public roomCode = new FormControl(null, [Validators.required, Validators.min(4)]);
  public username = new FormControl(null, [Validators.required]);

  constructor(
    public router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private backend: BackendRestService,
  ) {}

  ngOnInit() {
    if (this.route.snapshot.queryParams['link']) {
      // alert(this.route.snapshot.queryParams['link']);
      this.roomCode.setValue(this.route.snapshot.queryParams['link']);
      // alert(this.roomCode.value);
      this.validateRoomCode();
    }
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
    this.updateBeforeLessonRunDetails();
  }
  
  public validateRoomCode() {
    this.backend.validateRoomCode(this.roomCode.value).subscribe(
      (res: LessonRunDetails) => {
        this.backend.userEnteredroomCode = this.roomCode.value;
        const lessonrun_code = res.lessonrun_code;
        localStorage.setItem('lessonRunDetails', JSON.stringify(res));
        this.isRoomCodeValid = true;
        this.username.enable();
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

  getBeforeLessonRunDetails(lessonrun_code) {
    const request = global.apiRoot + '/course_details/lesson_run/' + lessonrun_code + '/lessonrun_details/';
    return this.http.post(request,{});
  }

  updateBeforeLessonRunDetails() {
    this.getBeforeLessonRunDetails(this.roomCode.value).subscribe((res: BeforeLessonRunDetails) => {
      this.beforeLessonRunDetails = res;
    });
  }

}

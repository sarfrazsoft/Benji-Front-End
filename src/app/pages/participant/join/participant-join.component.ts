import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import * as global from 'src/app/globals';
import { BackendRestService } from 'src/app/services';
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
  joinLinkExists = false;
  hostname = window.location.host + '/participant/join?link=';

  public roomCode = new FormControl(null, [Validators.required, Validators.min(4)]);

  constructor(
    public router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private backend: BackendRestService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((val: any) => {
      console.log(this.route.snapshot.queryParams['link']);
      if (this.route.snapshot.queryParams['link']) {
        this.joinLinkExists = true;
        this.roomCode.setValue(this.route.snapshot.queryParams['link']);
        this.updateBeforeLessonRunDetails();
        this.validateRoomCode();
      } else {
        this.joinLinkExists = false;
      }
    });
    if (this.route.snapshot.queryParams['link']) {
    } else {
      this.joinLinkExists = false;
    }
    // this.updateBeforeLessonRunDetails();
  }

  public validateRoomCode() {
    this.backend.validateRoomCode(this.roomCode.value).subscribe(
      (res: LessonRunDetails) => {
        this.backend.userEnteredroomCode = this.roomCode.value;
        const lessonrun_code = res.lessonrun_code;
        localStorage.setItem('lessonRunDetails', JSON.stringify(res));
        this.isRoomCodeValid = true;
        // take the user to next screen where they will input their name
        // const linkToNavigateTo = this.hostname + this.roomCode.value;
        // localhost:4200/participant/join?link=39622
        // this.router.navigate([''], { queryParams: { link: this.roomCode.value } });
        this.router.navigateByUrl('/participant/join?link=' + this.roomCode.value);
        // this.router.navigate([linkToNavigateTo]);
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

  onRoomCodeChange(roomCode: string): void {
    this.validateRoomCode();
  }

  getBeforeLessonRunDetails(lessonrun_code) {
    const request = global.apiRoot + '/course_details/lesson_run/' + lessonrun_code + '/lessonrun_details/';
    return this.http.post(request, {});
  }

  updateBeforeLessonRunDetails() {
    this.getBeforeLessonRunDetails(this.roomCode.value).subscribe((res: BeforeLessonRunDetails) => {
      this.beforeLessonRunDetails = res;
    });
  }
}

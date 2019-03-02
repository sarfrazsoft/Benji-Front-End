import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-main-screen-either-or-activity',
  templateUrl: './main-screen-either-or-activity.component.html',
  styleUrls: ['./main-screen-either-or-activity.component.scss']
})
export class MainScreenEitherOrActivityComponent extends BaseActivityComponent
  implements OnInit {
  ngOnInit() {
    // this.activityState.activity_status.icebreaker_stand = false;
    // this.activityState.activity_status.pets_question = true;
    // this.activityState.activity_status.pets_question_1 = true;
    // this.activityState.activity_status.pets_question_2 = false;
    // this.activityState.activity_status.sandwich_question = true;
    // this.activityState.activity_status.sandwich_question_1 = true;
    // this.activityState.activity_status.sandwich_question_2 = false;
    // this.activityState.activity_status.pets_move = false;
    // this.activityState.activity_status.result = false;
  }
}

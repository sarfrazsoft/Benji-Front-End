import { Component, OnInit, ViewChild } from '@angular/core';
import { EmojiLookupService } from 'src/app/services';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-title-activity',
  templateUrl: './title-activity.component.html',
  styleUrls: ['./title-activity.component.scss']
})
export class ParticipantTitleActivityComponent extends BaseActivityComponent
  implements OnInit {
  @ViewChild('titleTimer') titleTimer;

  constructor(public emoji: EmojiLookupService) {
    super();
  }

  ngOnInit() {}

  // ngAfterViewInit() {
  //   const titleSeconds =
  //     (Date.parse(
  //       this.activityState.base_activity.next_activity_start_timer.end_time
  //     ) -
  //       Date.now()) /
  //     1000;
  //   console.log(titleSeconds);
  //   this.titleTimer.startTimer(titleSeconds);
  // }
}

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EmojiLookupService } from 'src/app/services/emoji-lookup.service';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-main-screen-title-activity',
  templateUrl: './main-screen-title-activity.component.html',
  styleUrls: ['./main-screen-title-activity.component.scss']
})
export class MainScreenTitleActivityComponent extends BaseActivityComponent
  implements OnInit, AfterViewInit {
  @ViewChild('titleTimer') titleTimer;

  constructor(private emoji: EmojiLookupService) {
    super();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    const titleSeconds =
      (Date.parse(
        this.activityState.base_activity.next_activity_start_timer.end_time
      ) -
        Date.now()) /
      1000;
    this.titleTimer.startTimer(titleSeconds);
  }
}

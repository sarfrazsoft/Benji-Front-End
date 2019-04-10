import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmojiLookupService } from 'src/app/services/emoji-lookup.service';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-main-screen-title-activity',
  templateUrl: './main-screen-title-activity.component.html',
  styleUrls: ['./main-screen-title-activity.component.scss']
})
export class MainScreenTitleActivityComponent extends BaseActivityComponent
  implements OnInit, AfterViewInit {
  isEndSession = false;
  @ViewChild('titleTimer') titleTimer;

  constructor(private emoji: EmojiLookupService, private router: Router) {
    super();
  }

  ngOnInit() {
    if (
      this.activityState.base_activity.activity_id === 'end_session_activity'
    ) {
      this.isEndSession = true;
    }
  }

  public backToStart() {
    this.router.navigate(['/landing']);
  }

  ngAfterViewInit() {
    if (!this.isEndSession) {
      const titleSeconds =
        (Date.parse(
          this.activityState.base_activity.next_activity_start_timer.end_time
        ) -
          Date.now()) /
        1000;
      this.titleTimer.startTimer(titleSeconds);
    }
  }
}

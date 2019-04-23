import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-mcqresult-activity',
  templateUrl: './mcqresult-activity.component.html',
  styleUrls: ['./mcqresult-activity.component.scss']
})
export class MainScreenMcqresultActivityComponent extends BaseActivityComponent
  implements OnInit, AfterViewInit {
  @ViewChild('titleTimer') titleTimer;
  constructor() {
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

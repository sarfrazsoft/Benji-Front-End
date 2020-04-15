import { Component, OnInit } from '@angular/core';
import { GatherActivityContinueEvent } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-gather-activity',
  templateUrl: './gather-activity.component.html',
  styleUrls: ['./gather-activity.component.scss'],
})
export class MainScreenGatherActivityComponent extends BaseActivityComponent
  implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}

  gatherActivityContinueEvent() {
    this.sendMessage.emit(new GatherActivityContinueEvent());
  }
}

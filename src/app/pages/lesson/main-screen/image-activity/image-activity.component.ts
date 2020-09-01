import { Component, OnInit } from '@angular/core';
import { ImageActivity, Timer } from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-image-activity',
  templateUrl: './image-activity.component.html',
  styleUrls: ['./image-activity.component.scss'],
})
export class MainScreenImageActivityComponent extends BaseActivityComponent implements OnInit {
  act: ImageActivity;
  timer: Timer;
  hostname = window.location.protocol + '//' + window.location.hostname;
  // hostname = window.location.protocol + '//' + environment.host;
  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.act = this.activityState.imageactivity;
    this.timer = this.getNextActStartTimer();
  }
}

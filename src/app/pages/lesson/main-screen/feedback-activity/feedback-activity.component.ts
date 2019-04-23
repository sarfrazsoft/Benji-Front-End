import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-feedback-activity',
  templateUrl: './feedback-activity.component.html',
  styleUrls: ['./feedback-activity.component.scss']
})
export class MainScreenFeedbackActivityComponent extends BaseActivityComponent {
  constructor() {
    super();
  }
}

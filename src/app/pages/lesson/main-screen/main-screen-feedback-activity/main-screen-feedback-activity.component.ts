import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'app-main-screen-feedback-activity',
  templateUrl: './main-screen-feedback-activity.component.html',
  styleUrls: ['./main-screen-feedback-activity.component.scss']
})
export class MainScreenFeedbackActivityComponent extends BaseActivityComponent {
  constructor() {
    super();
  }
}

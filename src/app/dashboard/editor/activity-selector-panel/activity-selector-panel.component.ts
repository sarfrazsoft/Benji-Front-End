import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'benji-activity-selector-panel',
  templateUrl: './activity-selector-panel.component.html',
  styleUrls: ['./activity-selector-panel.component.scss'],
})
export class ActivitySelectorPanelComponent implements OnInit {
  selectedTab = 0;
  constructor() {}

  ngOnInit() {}

  showSignupTab(): void {
    this.selectedTab = 1;
  }
}

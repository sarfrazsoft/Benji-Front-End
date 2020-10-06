import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromStore from '../store';

@Component({
  selector: 'benji-activity-selector-panel',
  templateUrl: './activity-selector-panel.component.html',
  styleUrls: ['./activity-selector-panel.component.scss'],
})
export class ActivitySelectorPanelComponent implements OnInit {
  selectedTab = 0;
  lessonActivity;
  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    // maybe selected tab should be controlled by state as well
    // so we can change the tabs from other places
    this.store.select(fromStore.getSelectedLessonActivity).subscribe((val) => {
      this.lessonActivity = val;
      if (this.lessonActivity && this.lessonActivity.empty) {
        this.selectedTab = 0;
      }
    });
  }

  showSignupTab(): void {
    this.selectedTab = 1;
  }
}

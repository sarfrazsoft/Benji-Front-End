import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Activity } from '../models';
import * as fromStore from '../store';

@Component({
  selector: 'benji-overview-panel',
  templateUrl: './overview-panel.component.html',
  styleUrls: ['./overview-panel.component.scss'],
})
export class OverviewPanelComponent implements OnInit {
  lessonActivities$: Observable<Activity[]>;
  lessonActivitiesLength;

  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    this.lessonActivities$ = this.store.select(fromStore.getAllLessonActivities);
    this.lessonActivities$.subscribe((arr) => {
      this.lessonActivitiesLength = arr.length;
    });
  }

  select(activityId) {
    this.store.dispatch(new fromStore.SelectLessonActivity(activityId));
  }

  deleteActivity(activityId) {
    if (this.lessonActivitiesLength > 1) {
      this.store.dispatch(new fromStore.RemoveLessonActivity(activityId));
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.store.dispatch(new fromStore.ReorderLessonActivities(event.container.data));
  }
  addSlide() {
    this.store.dispatch(new fromStore.AddEmptyLessonActivity());
  }
}

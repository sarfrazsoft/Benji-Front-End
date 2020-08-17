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
  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    this.lessonActivities$ = this.store.select(fromStore.getAllLessonActivities);

    this.lessonActivities$.subscribe((x) => console.log(x));
  }

  select(activityId) {
    this.store.dispatch(new fromStore.SelectLessonActivity(activityId));
  }

  deleteActivity(activityId) {
    this.store.dispatch(new fromStore.RemoveLessonActivity(activityId));
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromStore from '../../store';

@Component({
  selector: 'benji-activity-types',
  templateUrl: './activity-types.component.html',
  styleUrls: ['./activity-types.component.scss'],
})
export class ActivityTypesComponent implements OnInit {
  activities$: Observable<any[]>;
  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    this.activities$ = this.store.select(fromStore.getAllPossibleActivities);

    this.store.dispatch(new fromStore.LoadAllPossibleActivites());
  }

  selectActivity(activityId) {
    this.store.dispatch(new fromStore.SelectActivityType(activityId));
  }

  mouseOver(categoryId, activity: any) {
    if (!activity.mouseOvered) {
      const activityId = activity.id;
      this.store.dispatch(new fromStore.ActivityHovered({ categoryId, activityId }));
    }
  }

  mouseOut(categoryId, activity: any) {
    if (activity.mouseOvered) {
      const activityId = activity.id;
      this.store.dispatch(new fromStore.ActivityHoverEnd({ categoryId, activityId }));
    }
  }
}

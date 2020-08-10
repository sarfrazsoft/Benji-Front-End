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
  possibleActivities$: Observable<any[]>;
  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    this.possibleActivities$ = this.store.select(
      fromStore.getAllPossibleActivities
    );

    // this.possibleActivities$.subscribe((x) => console.log(x));
  }

  mouseOver(categoryId, activity: any) {
    // dispatch event to store
    // activity.mouseOvered = true
    if (!activity.mouseOvered) {
      const activityId = activity.id;
      this.store.dispatch(
        new fromStore.ActivityHovered({ categoryId, activityId })
      );
    }
  }

  mouseOut(activityId: number) {
    // dispatch event to store
    // activity.mouseOvered = false
  }
}

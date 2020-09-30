import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';
import * as fromStore from '../../store';

@Component({
  selector: 'benji-activity-types',
  templateUrl: './activity-types.component.html',
  styleUrls: ['./activity-types.component.scss'],
})
export class ActivityTypesComponent implements OnInit {
  activities$: Observable<any[]>;
  imgSrc = '';
  hostname = window.location.protocol + '//' + environment.host;
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

  getThumbnailSrc(activity) {
    return this.hostname + activity.thumbnail;
  }
}

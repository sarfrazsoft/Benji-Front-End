import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromStore from '../../../store';

@Component({
  selector: 'benji-selector-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit, OnDestroy {
  @Input() activity;
  hover = false;
  imgSrc = '';
  hostname = window.location.protocol + '//' + environment.host;
  selectedPossibleActivity = '';
  sub: Subscription;
  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    // this.activities$ = this.store.select(fromStore.getAllPossibleActivities);
    this.sub = this.store.select(fromStore.getSelectedPossibleActivity).subscribe((val) => {
      this.selectedPossibleActivity = val;
    });
  }
  getThumbnailSrc(activity) {
    return this.hostname + activity.thumbnail;
  }

  selectActivity(activityId) {
    if (this.selectedPossibleActivity === activityId) {
      return;
    }
    this.store.dispatch(new fromStore.SelectActivityType(activityId));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

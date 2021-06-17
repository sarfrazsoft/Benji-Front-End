import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromStore from '../../store';

@Component({
  selector: 'benji-activity-types',
  templateUrl: './activity-types.component.html',
})
export class ActivityTypesComponent implements OnInit {
  activities$: Observable<any[]>;

  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    this.activities$ = this.store.select(fromStore.getAllPossibleActivities);

    this.store.dispatch(new fromStore.LoadAllPossibleActivites());
  }
}

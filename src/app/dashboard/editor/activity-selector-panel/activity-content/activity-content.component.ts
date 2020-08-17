import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FieldTypes } from '../../models/activity.model';
import * as fromStore from '../../store';

@Component({
  selector: 'benji-activity-content',
  templateUrl: './activity-content.component.html',
  styleUrls: ['./activity-content.component.scss'],
})
export class ActivityContentComponent implements OnInit {
  activity$: Observable<any>;
  fields$: Observable<any>;
  fieldTypes = FieldTypes;
  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    this.activity$ = this.store.select(fromStore.getSelectedLessonActivity);

    this.fields$ = this.store.select(fromStore.getSelectedLessonActivityFields);

    this.activity$.subscribe((x) => console.log(x));

    this.fields$.subscribe((x) => console.log(x));
  }
}

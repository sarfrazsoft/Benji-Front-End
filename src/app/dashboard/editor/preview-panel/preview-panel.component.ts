import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import * as fromStore from '../store';

@Component({
  selector: 'benji-preview-panel',
  templateUrl: './preview-panel.component.html',
  styleUrls: ['./preview-panel.component.scss'],
})
export class PreviewPanelComponent implements OnInit {
  activity$: Observable<any>;
  fields$: Observable<any>;
  content$: Observable<any>;
  possibleActivities$: Observable<any>;

  imgSrc = '';
  showImage = false;
  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    this.activity$ = this.store.select(fromStore.getSelectedLessonActivity);
    this.possibleActivities$ = this.store.select(fromStore.getAllPossibleActivities);

    this.content$ = this.store.select(fromStore.getSelectedLessonActivityContent);

    combineLatest([this.activity$, this.possibleActivities$, this.content$])
      .pipe(
        map(([a$, b$, c$]) => ({
          activity: a$,
          possibleActivities: b$,
          content: c$,
        }))
      )
      .subscribe((pair) => {
        if (pair.activity && !pair.activity.empty && pair.possibleActivities.length) {
          // console.log(pair);
          this.showImage = true;
        } else if (pair.activity && pair.activity.empty) {
          this.showImage = false;
        }
      });
  }
}

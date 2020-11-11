import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ActivityTypes as Acts } from 'src/app/globals';
import { environment } from 'src/environments/environment';
import * as fromStore from '../store';

@Component({
  selector: 'benji-preview-panel',
  templateUrl: './preview-panel.component.html',
  styleUrls: ['./preview-panel.component.scss'],
})
export class PreviewPanelComponent implements OnInit {
  previewTemplate = false;
  activity$: Observable<any>;
  fields$: Observable<any>;
  content$: Observable<any>;
  possibleActivities$: Observable<any>;

  activityData;

  hostname = window.location.protocol + '//' + environment.host;
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
        if (pair.activity && pair.activity.empty === false && pair.possibleActivities.length) {
          const act_type = pair.activity.activity_type;
          if (act_type === Acts.title) {
            this.previewTemplate = true;
            this.activityData = { activity_type: act_type, content: pair.content };
          } else {
            this.previewTemplate = false;
          }

          const s = pair.possibleActivities.filter((pa) => pa.id === act_type)[0].schema;
          this.imgSrc = this.hostname + s.preview_image;
          this.showImage = true;
        } else if (pair.activity && pair.activity.empty) {
          this.showImage = false;
        }
      });
  }
}

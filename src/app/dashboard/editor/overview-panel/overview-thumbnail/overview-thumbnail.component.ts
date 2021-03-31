import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { OverviewLessonActivity } from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
import * as fromStore from '../../store';

@Component({
  selector: 'benji-overview-thumbnail',
  templateUrl: './overview-thumbnail.component.html',
  styleUrls: ['./overview-thumbnail.component.scss'],
})
export class OverviewThumbnailComponent implements OnInit, OnDestroy {
  @Input() act: OverviewLessonActivity;
  hostname = window.location.protocol + '//' + environment.host;
  imgSrc = '';
  displayText = '';

  thumbnailObservable;
  overviewTextObservable;
  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    this.getThumbnailSrc(this.act);
    this.getOverviewText(this.act);
  }

  getThumbnailSrc(activity: OverviewLessonActivity) {
    if (activity.activity_type) {
      this.thumbnailObservable = this.store
        .select(fromStore.getActivityThumbnail(activity.activity_type))
        .subscribe((res) => {
          this.imgSrc = this.hostname + res;
          return this.imgSrc;
        });
    } else {
      this.imgSrc = '/assets/img/blank_activity.svg';
    }
  }

  getOverviewText(activity: OverviewLessonActivity) {
    this.overviewTextObservable = this.store
      .select(fromStore.getLessonActivityContent(activity.id))
      .subscribe((res) => {
        if (res && res.activity_overview_text) {
          this.displayText = this.getDescendantProp(res, res.activity_overview_text)
            ? this.getDescendantProp(res, res.activity_overview_text)
            : activity.displayName;
        } else {
          this.displayText = '';
        }
      });
  }

  getDescendantProp(obj, desc) {
    const arr = desc.split('.');
    while (arr.length && (obj = obj[arr.shift()])) {}
    return obj;
  }

  ngOnDestroy() {
    if (this.thumbnailObservable) {
      this.thumbnailObservable.unsubscribe();
    }

    if (this.overviewTextObservable) {
      this.overviewTextObservable.unsubscribe();
    }
  }
}

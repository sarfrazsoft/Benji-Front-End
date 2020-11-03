import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { forkJoin, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { OverviewLessonActivity } from 'src/app/services/backend/schema';
import * as fromStore from '../store';

@Component({
  selector: 'benji-overview-panel',
  templateUrl: './overview-panel.component.html',
  styleUrls: ['./overview-panel.component.scss'],
})
export class OverviewPanelComponent implements OnInit {
  lessonActivities$: Observable<OverviewLessonActivity[]>;
  lessonActivitiesLength;

  slideCopied = false;
  addedSlide: OverviewLessonActivity;
  slideToBeCopied: OverviewLessonActivity;

  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    this.lessonActivities$ = this.store.select(fromStore.getAllLessonActivities);
    this.lessonActivities$.subscribe((arr) => {
      this.lessonActivitiesLength = arr.length;
      if (this.slideCopied) {
        this.slideCopied = false;

        this.addedSlide = arr[this.slideToBeCopied.order];
        this.store
          .select(fromStore.getLessonActivityContent(this.slideToBeCopied.id))
          .pipe(take(1))
          .subscribe((res) => {
            const activityContent = res;
            // console.log(activityContent);
            const content = cloneDeep(activityContent);
            content['activity_id'] = this.addedSlide.id;

            this.store.dispatch(new fromStore.SelectActivityType(activityContent.activity_type));

            // setTimeout(() => {
            this.store.dispatch(new fromStore.AddActivityContent(content));
            this.store.dispatch(new fromStore.SelectLessonActivity(content['activity_id']));
            // }, 400);
          });
      }
    });
  }

  select(activityId) {
    this.store.dispatch(new fromStore.SelectLessonActivity(activityId));
  }

  deleteActivity(activityId) {
    if (this.lessonActivitiesLength > 1) {
      this.store.dispatch(new fromStore.RemoveLessonActivity(activityId));
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.store.dispatch(new fromStore.ReorderLessonActivities(event.container.data));
  }
  addSlide() {
    this.store.dispatch(new fromStore.AddEmptyLessonActivity());
  }

  copySlide(event, activity: OverviewLessonActivity) {
    event.stopPropagation();
    this.slideCopied = true;
    this.slideToBeCopied = activity;
    // this.store.dispatch(new fromStore.AddEmptyLessonActivity());
    this.store.dispatch(new fromStore.AddEmptyLessonActivityAtIndex(activity.order));
  }
}

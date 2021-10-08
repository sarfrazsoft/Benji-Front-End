import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { OverviewLessonActivity } from 'src/app/services/backend/schema';
import { ConfirmationDialogComponent } from 'src/app/shared';
import { EditorService } from '../services/editor.service';
import * as fromStore from '../store';

@Component({
  selector: 'benji-overview-panel',
  templateUrl: './overview-panel.component.html',
})
export class OverviewPanelComponent implements OnInit, OnDestroy {
  lessonActivities$: Observable<OverviewLessonActivity[]>;
  lessonActivitiesSubscription$: Subscription;
  lessonActivitiesLength;
  @Input() lessonId;

  lessonActivitiesErrors$: Observable<any>;
  lessonActivitiesErrors;

  slideCopied = false;
  addedSlide: OverviewLessonActivity;
  slideToBeCopied: OverviewLessonActivity;
  dialogRef;

  constructor(
    private store: Store<fromStore.EditorState>,
    private matDialog: MatDialog,
    private editorService: EditorService
  ) {}

  ngOnInit() {
    this.lessonActivities$ = this.store.select(fromStore.getAllLessonActivities);
    this.lessonActivitiesSubscription$ = this.lessonActivities$.subscribe((arr) => {
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

    // get lesson actvities errors
    this.lessonActivitiesErrors$ = this.store.select(fromStore.getAllLessonActivitiesErrors);
    this.lessonActivitiesErrors$.subscribe((arr) => {
      this.lessonActivitiesErrors = arr;
    });
  }

  ngOnDestroy() {
    if (this.lessonActivitiesSubscription$) {
      this.lessonActivitiesSubscription$.unsubscribe();
    }
  }

  select(activityId) {
    this.store.dispatch(new fromStore.SelectLessonActivity(activityId));
  }

  deleteActivity(activityId) {
    const msg = 'Are you sure you want to delete this activity?';
    this.dialogRef = this.matDialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: msg,
          actionButton: 'Delete',
        },
        disableClose: true,
        panelClass: 'dashboard-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        console.log(res);
        if (res) {
          if (this.lessonActivitiesLength > 1) {
            this.store.dispatch(new fromStore.RemoveLessonActivity(activityId));
          }
        }
      });
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

  uploadFile($event) {
    console.log($event.target.files[0]); // outputs the first file
    const file = $event.target.files[0];
    if (file) {
      this.editorService
        .uploadFile(file, this.lessonId)
        .pipe(
          map((res) => res),
          catchError((error) => error)
        )
        .subscribe((res) => {
          console.log(res);
        });
    }
    const url = '';
  }
}

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EditorService } from '../../services/editor.service';
import * as ActivityActions from '../actions/activities.action';

import { SAMPLE_ACTIVITIES } from '../../models';

@Injectable()
export class ActivitiesEffects {
  constructor(private actions$: Actions, private editorService: EditorService) {}

  @Effect()
  loadAllPossibleActivities$ = this.actions$.pipe(
    ofType(ActivityActions.LOAD_ALL_POSSIBLE_ACTIVITIES),
    switchMap(() => {
      return this.editorService.getActivites().pipe(
        map((activities) => {
          return new ActivityActions.LoadAllPossibleSuccess(activities);
        }),
        catchError((error) => of(new ActivityActions.LoadAllPossibleFail(error)))
      );
    })
  );

  @Effect()
  loadLessonActivities$ = this.actions$.pipe(
    ofType(ActivityActions.LOAD_LESSON_ACTIVITIES),
    map((action: ActivityActions.LoadLessonActivites) => action.payload),
    switchMap((lessonId: any) => {
      console.log(lessonId);
      return this.editorService.getActivites().pipe(
        map((activities) => {
          return new ActivityActions.LoadLessonActivitiesSuccess(activities);
        }),
        catchError((error) => of(new ActivityActions.LoadAllPossibleFail(error)))
      );
    })
  );

  @Effect()
  saveLesson$ = this.actions$.pipe(
    ofType(ActivityActions.SAVE_LESSON),
    map((action: ActivityActions.SaveLesson) => action.payload),
    switchMap((lesson: any) => {
      console.log('lesson saved');
      console.log(lesson);
      return this.editorService.saveLesson(lesson).pipe(
        map((activities) => {
          return new ActivityActions.SaveLessonSuccess(activities);
        }),
        catchError((error) => of(new ActivityActions.LoadAllPossibleFail(error)))
      );
    })
  );
}

import { Injectable, ɵsetCurrentInjector } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { EditorService } from '../../services/editor.service';
import * as ActivityActions from '../actions/activities.action';
import * as fromStore from '../index';
import * as fromActivities from '../reducers';

import { Store } from '@ngrx/store';
import { valueOf } from 'core-js/fn/_';
import { SAMPLE_ACTIVITIES } from '../../models';

@Injectable()
export class ActivitiesEffects {
  constructor(
    private actions$: Actions,
    private editorService: EditorService,
    private store: Store<fromStore.EditorState>
  ) {}

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
  addActivityContent$ = this.actions$.pipe(
    ofType(ActivityActions.ADD_ACTIVITY_CONTENT),
    map((action: ActivityActions.AddActivityContent) => {}),
    withLatestFrom(this.store.select(fromActivities.getEditorState)),
    switchMap(([lesson, wholeState]) => {
      const contentObjs = wholeState.activities.lessonActivitiesContent;
      const contentArray = Object.keys(contentObjs).map((id) => contentObjs[id]);
      console.log(contentArray);
      // const lesson = [
      //   {
      //     activity_type: 'LobbyActivity',
      //     activity_id: 'lobby1',
      //     description: 'hello world',
      //   },
      //   { ...act, activity_type: act.activity_id },
      // ];
      // const lessonActs = [];
      // contentArray.forEach((val) => {
      //   lessonActs.push({
      //     ...val,
      //     activity_type: val.activity_id.split('_')[0],
      //   });
      // });
      const lessonActs = [
        {
          activity_type: 'LobbyActivity',
          activity_id: 'lobby1',
          description: 'hello world',
        },
        {
          activity_type: 'TitleActivity',
          activity_id: 'title1',
          main_title: 'Hello World',
        },
      ];
      console.log(lessonActs);
      return this.editorService.saveLesson(lessonActs).pipe(
        map((activities) => {
          console.log(activities);
          return new ActivityActions.SaveLessonSuccess(activities);
        }),
        catchError((error) => of(new ActivityActions.SaveLessonFailure(error)))
      );
    })
  );

  @Effect()
  saveLessonSuccess$ = this.actions$.pipe(
    ofType(ActivityActions.SAVE_LESSON_SUCCESS),
    map((action: ActivityActions.SaveLessonSuccess) => action.payload),
    switchMap((yaml: any) => {
      console.log(yaml);
      return this.editorService.saveYAML(yaml).pipe(
        map((activities) => {
          return new ActivityActions.LoadLessonActivitiesSuccess(activities);
        }),
        catchError((error) => of(new ActivityActions.LoadAllPossibleFail(error)))
      );
    })
  );
}

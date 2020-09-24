import { Injectable, ɵsetCurrentInjector } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { EditorService } from '../../services/editor.service';
import * as ActivityActions from '../actions/activities.action';
import * as fromStore from '../index';
import * as fromActivities from '../reducers';

@Injectable()
export class ActivitiesEffects {
  constructor(
    private actions$: Actions,
    private editorService: EditorService,
    private store: Store<fromStore.EditorState>
  ) {}

  @Effect()
  saveEmptyLesson$ = this.actions$.pipe(
    ofType(ActivityActions.SAVE_EMPTY_LESSON),
    switchMap(() => {
      const lesson: Lesson = {
        lesson_name: 'untitled lesson',
      };
      return this.editorService.saveEmptyLesson(lesson).pipe(
        map((activities) => {
          return new ActivityActions.SaveLessonSuccess(activities);
        }),
        catchError((error) => of(new ActivityActions.SaveLessonFailure(error)))
      );
    })
  );

  @Effect()
  updateLessonName$ = this.actions$.pipe(
    ofType(ActivityActions.UPDATE_LESSON_NAME),
    map((action: ActivityActions.UpdateLessonName) => action.payload),
    withLatestFrom(this.store.select(fromActivities.getEditorState)),
    switchMap(([lessonName, wholeState]) => {
      const lesson: Lesson = {
        lesson_name: lessonName,
        id: wholeState.activities.lessonId,
      };
      return this.editorService.updateLesson(lesson, wholeState.activities.lessonId).pipe(
        map((activities) => {
          return new ActivityActions.UpdateLessonNameSuccess(activities);
        }),
        catchError((error) => of(new ActivityActions.UpdateLessonNameFailure(error)))
      );
    })
  );

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
      return this.editorService.getLessonActivities(lessonId).pipe(
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
      // console.log(contentArray);
      // const lesson = [
      //   {
      //     activity_type: 'LobbyActivity',
      //     activity_id: 'lobby1',
      //     description: 'hello world',
      //   },
      //   { ...act, activity_type: act.activity_id },
      // ];
      const lessonActs = [];
      contentArray.forEach((val) => {
        lessonActs.push({
          ...val,
        });
      });

      const lesson_json: Lesson = {
        lesson_name: wholeState.activities.lessonName,
        editor_lesson_plan: contentArray,
      };
      // const lessonActs = [
      //   {
      //     activity_type: 'LobbyActivity',
      //     activity_id: 'lobby1',
      //     description: 'hello world',
      //   },
      //   {
      //     activity_type: 'TitleActivity',
      //     activity_id: 'title1',
      //     main_title: 'Hello World',
      //   },
      // ];
      // console.log(lessonActs);
      return this.editorService.updateLesson(lesson_json, wholeState.activities.lessonId).pipe(
        map((res: any) => {
          return new ActivityActions.SaveLessonSuccess(res);
        }),
        catchError((error) => of(new ActivityActions.SaveLessonFailure(error)))
      );
    })
  );
}

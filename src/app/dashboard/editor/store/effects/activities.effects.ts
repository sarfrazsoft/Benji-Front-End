import { Injectable, ɵsetCurrentInjector } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ActivityTypes } from 'src/app/globals';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { EditorService } from '../../services/editor.service';
import * as ActivityActions from '../actions/activities.action';
import * as fromStore from '../index';
import * as fromActivities from '../reducers';

@Injectable()
export class ActivitiesEffects {
  at: typeof ActivityTypes = ActivityTypes;
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
      const lessonActivities = wholeState.activities.lessonActivities;
      const order = Object.keys(lessonActivities).sort(function (a, b) {
        return lessonActivities[a].order - lessonActivities[b].order;
      });

      const contentArray = [];
      order.forEach((val) => {
        if (contentObjs[val]) {
          contentArray.push(contentObjs[val]);
        }
      });
      const newContentArray = cloneDeep(contentArray);
      for (let i = 0; i < newContentArray.length; i++) {
        if (
          newContentArray[i].activity_type === this.at.caseStudy ||
          newContentArray[i].activity_type === this.at.genericRoleplay
        ) {
          const subjectAct = newContentArray[i];
          if (
            subjectAct.grouping_activity_id === true ||
            subjectAct.grouping_activity_type === 'ExternalGroupingActivity'
          ) {
            const newIndex = new Date().getTime();
            const groupingActivity = {
              activity_id: '' + newIndex,
              activity_type: 'ExternalGroupingActivity',
              description: 'x',
              next_activity_delay_seconds: 0,
              grouping_seconds: 10000,
            };
            newContentArray.splice(i, 0, groupingActivity);
            subjectAct.grouping_activity_id = newIndex + '';
            // subjectAct.grouping_activity_id = null;
          } else if (
            subjectAct.grouping_activity_id === false ||
            subjectAct.grouping_activity_type === 'SingleGroupingActivity'
          ) {
            const newIndex = new Date().getTime();
            const groupingActivity = {
              activity_id: '' + newIndex,
              activity_type: 'SingleGroupingActivity',
              description: 'x',
              next_activity_delay_seconds: 0,
              grouping_seconds: 0,
            };
            newContentArray.splice(i, 0, groupingActivity);
            subjectAct.grouping_activity_id = newIndex + '';
          }
          // increament i so that it skips the casestudy activity now
          // that it has been moved to the next index in array
          i++;
        } else if (newContentArray[i].activity_type === this.at.mcq) {
          const mcqAct = newContentArray[i];

          if (newContentArray[i + 1] && newContentArray[i + 1].activity_type === this.at.mcqResults) {
            // this mcqAct already has a mcq results activity we don't need to add
          } else {
            if (mcqAct.show_distribution) {
              // setTimeout(() => {
              // add mcqresultactivity
              const newIndex = new Date().getTime();
              const mcqresultactivity = {
                activity_id: newIndex + '_' + mcqAct.activity_id,
                activity_type: 'MCQResultsActivity',
                description: 'Here are your results',
                next_activity_delay_seconds: 10000,
                poll_mode: true,
                summary_questions: [{ question_id: mcqAct.activity_id }],
              };
              newContentArray.splice(i + 1, 0, mcqresultactivity);
              // }, 0);
            } else {
              // this mcqAct doesn't need a mcqresults activity
            }
          }
        }
      }

      const lesson_json: Lesson = {
        lesson_name: wholeState.activities.lessonName,
        // editor_lesson_plan: [],
        editor_lesson_plan: newContentArray,
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
      // console.log(lesson_json);
      return this.editorService.updateLesson(lesson_json, wholeState.activities.lessonId).pipe(
        map((res: any) => {
          return new ActivityActions.SaveLessonSuccess(res);
        }),
        catchError((error) => of(new ActivityActions.SaveLessonFailure(error)))
      );
    })
  );
}

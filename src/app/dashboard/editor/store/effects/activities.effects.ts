import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EditorService } from '../../services/editor.service';
import * as ActivityActions from '../actions/activities.action';

import { SAMPLE_ACTIVITIES } from '../../models';

@Injectable()
export class ActivitiesEffects {
  constructor(
    private actions$: Actions,
    private editorService: EditorService
  ) {}

  @Effect()
  loadActivities$ = this.actions$.pipe(
    ofType(ActivityActions.LOAD_ACTIVITIES),
    switchMap(() => {
      return this.editorService.getActivites().pipe(
        map((activities) => {
          console.log('bawa ji');
          const placeholder = [
            {
              name: '',
              id: 999999999,
              activity_type: 'new type',
            },
          ];
          return new ActivityActions.LoadActivitesSuccess(placeholder);
        }),
        catchError((error) => of(new ActivityActions.LoadActivitesFail(error)))
      );
    })
  );
}

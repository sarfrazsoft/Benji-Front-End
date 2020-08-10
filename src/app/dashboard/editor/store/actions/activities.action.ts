import { Action } from '@ngrx/store';

import { Activity } from '../../models';

// load activities
export const LOAD_ACTIVITIES = '[Sessions] Load  Activities';
export const LOAD_ACTIVITIES_FAIL = '[Sessions] Load  Activities Fail';
export const LOAD_ACTIVITIES_SUCCESS = '[Sessions] Load Activities Success ';

export class LoadActivites implements Action {
  readonly type = LOAD_ACTIVITIES;
}

export class LoadActivitesFail implements Action {
  readonly type = LOAD_ACTIVITIES_FAIL;
  constructor(public payload: any) {}
}
export class LoadActivitesSuccess implements Action {
  readonly type = LOAD_ACTIVITIES_SUCCESS;
  constructor(public payload: Activity[]) {}
}

// add activities
export const CREATE_ACTIVITY = '[Sessions] Create Activity';
export const CREATE_ACTIVITY_FAIL = '[Sessions] Create Activity Fail';
export const CREATE_ACTIVITY_SUCCESS = '[Sessions] Create Activity Success ';

export class CreateActivity implements Action {
  readonly type = CREATE_ACTIVITY;
  constructor(public payload: Activity) {}
}

export class CreateActivityFail implements Action {
  readonly type = CREATE_ACTIVITY_FAIL;
  constructor(public payload: any) {}
}

export class CreateActivitySuccess implements Action {
  readonly type = CREATE_ACTIVITY_SUCCESS;
  constructor(public payload: Activity) {}
}

// Add placeholder activity in overivew panel
export const ADD_PLACEHOLDER_ACTIVITY = '[Sessions] Add Placeholder Activity';
export const REMOVE_PLACEHOLDER_ACTIVITY =
  '[Sessions] Remove Placeholder Activity';

export class AddPlaceholderActivity implements Action {
  readonly type = ADD_PLACEHOLDER_ACTIVITY;
  constructor() {}
}

export class RemovePlaceholderActivity implements Action {
  readonly type = REMOVE_PLACEHOLDER_ACTIVITY;
  constructor() {}
}

// Mouse over event in activity selector
export const ACTIVITY_HOVERED = '[Sessions] Activity hovered';

export class ActivityHovered implements Action {
  readonly type = ACTIVITY_HOVERED;
  constructor(public payload: { categoryId: number; activityId: number }) {}
}

// export action types
export type ActivitiesAction =
  | LoadActivites
  | LoadActivitesFail
  | LoadActivitesSuccess
  | CreateActivity
  | CreateActivityFail
  | CreateActivitySuccess
  | AddPlaceholderActivity
  | RemovePlaceholderActivity
  | ActivityHovered;

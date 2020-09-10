import { Action } from '@ngrx/store';
import { Activity } from '../../models';

// Load all possible activities
export const LOAD_ALL_POSSIBLE_ACTIVITIES = '[Selector Panel] Load All Possible  Activities';
export const LOAD_ALL_POSSIBLE_ACTIVITIES_FAIL = '[Selector Panel] Load All Possible Activities Fail';
export const LOAD_ALL_POSSIBLE_ACTIVITIES_SUCCESS = '[Selector Panel] Load All Possible Activities Success ';

export class LoadAllPossibleActivites implements Action {
  readonly type = LOAD_ALL_POSSIBLE_ACTIVITIES;
}

export class LoadAllPossibleFail implements Action {
  readonly type = LOAD_ALL_POSSIBLE_ACTIVITIES_FAIL;
  constructor(public payload: any) {}
}
export class LoadAllPossibleSuccess implements Action {
  readonly type = LOAD_ALL_POSSIBLE_ACTIVITIES_SUCCESS;
  constructor(public payload: any[]) {}
}

// Load lesson activities
export const LOAD_LESSON_ACTIVITIES = '[Editor] Load Lesson Activities';
export const LOAD_LESSON_ACTIVITIES_FAIL = '[Editor] Load Lesson Activities Fail';
export const LOAD_LESSON_ACTIVITIES_SUCCESS = '[Editor] Load Lesson Activities Success ';

export class LoadLessonActivites implements Action {
  readonly type = LOAD_LESSON_ACTIVITIES;
  constructor(public payload: any) {}
}

export class LoadLesssonActivitiesFail implements Action {
  readonly type = LOAD_LESSON_ACTIVITIES_FAIL;
  constructor(public payload: any) {}
}
export class LoadLessonActivitiesSuccess implements Action {
  readonly type = LOAD_LESSON_ACTIVITIES_SUCCESS;
  constructor(public payload: any) {}
}

// Add empty activity to lesson activities
export const ADD_EMPTY_LESSON_ACTIVITY = '[Overview panel] Add empty lesson Activity';
export const REMOVE_LESSON_ACTIVITY = '[Overview panel] Delete lesson activity';
export const SELECT_LESSON_ACTIVITY = '[Overview panel] Select lesson activity';
export const REORDER_LESSON_ACTIVITIES = '[Overview panel] Re-order lesson activities after sorting';

export class AddEmptyLessonActivity implements Action {
  readonly type = ADD_EMPTY_LESSON_ACTIVITY;
}

export class RemoveLessonActivity implements Action {
  readonly type = REMOVE_LESSON_ACTIVITY;
  constructor(public payload: number) {}
}

export class SelectLessonActivity implements Action {
  readonly type = SELECT_LESSON_ACTIVITY;
  constructor(public payload: number) {}
}

export class ReorderLessonActivities implements Action {
  readonly type = REORDER_LESSON_ACTIVITIES;
  constructor(public payload: any) {}
}

// Activity selected under 'Type' tab in activity selector panel
export const SELECT_ACTIVITY_TYPE = '[Selector Panel] Activity selected under Type tab';

export class SelectActivityType implements Action {
  readonly type = SELECT_ACTIVITY_TYPE;
  constructor(public payload: number) {}
}

// Content added to selected activity under 'Content' tab in activity selector panel
export const ADD_ACTIVITY_CONTENT = '[Selector Panel] Content added to activity under Content tab';

export class AddActivityContent implements Action {
  readonly type = ADD_ACTIVITY_CONTENT;
  constructor(public payload: any) {}
}

// Save lesson
export const SAVE_LESSON = '[Editor] Save lesson';
export const SAVE_LESSON_SUCCESS = '[Editor] Save lesson success';
export const SAVE_LESSON_FAILURE = '[Editor] Save lesson failure';

export class SaveLesson implements Action {
  readonly type = SAVE_LESSON;
  constructor() {}
}

export class SaveLessonSuccess implements Action {
  readonly type = SAVE_LESSON_SUCCESS;
  constructor(public payload: any) {}
}

export class SaveLessonFailure implements Action {
  readonly type = SAVE_LESSON_FAILURE;
  constructor(public payload: any) {}
}

// Mouse over event in activity selector
export const ACTIVITY_HOVERED = '[Selector Panel] Activity hovered';

export class ActivityHovered implements Action {
  readonly type = ACTIVITY_HOVERED;
  constructor(public payload: { categoryId: number; activityId: number }) {}
}

export const ACTIVITY_HOVER_END = '[Selector Panel] Activity hover ended';

export class ActivityHoverEnd implements Action {
  readonly type = ACTIVITY_HOVER_END;
  constructor(public payload: { categoryId: number; activityId: number }) {}
}

// export action types
export type ActivitiesAction =
  | LoadAllPossibleActivites
  | LoadAllPossibleFail
  | LoadAllPossibleSuccess
  | LoadLessonActivites
  | LoadLessonActivitiesSuccess
  | LoadLesssonActivitiesFail
  | AddEmptyLessonActivity
  | RemoveLessonActivity
  | SelectLessonActivity
  | SaveLesson
  | SaveLessonSuccess
  | SaveLessonFailure
  | ReorderLessonActivities
  | ActivityHovered
  | ActivityHoverEnd
  | SelectActivityType
  | AddActivityContent;

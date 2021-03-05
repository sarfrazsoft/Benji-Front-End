import { createSelector } from '@ngrx/store';
import * as fromActivities from '../reducers';
import * as fromReducers from '../reducers/activities.reducers';

// activities state
export const getActivitiesState = createSelector(
  fromActivities.getEditorState,
  (state: fromActivities.EditorState) => state.activities
);

export const getPossibleActivities = createSelector(getActivitiesState, fromReducers.getPossibleActivities);

export const getSelectedLessonActivityContent = createSelector(
  getActivitiesState,
  fromReducers.getSelectedLessonActivityContent
);

export const getLessonActivityContent = (id) =>
  createSelector(getActivitiesState, (entities) => {
    return entities.lessonActivitiesContent[id];
  });

export const getAllPossibleActivities = createSelector(getPossibleActivities, (entities) => {
  return Object.keys(entities).map((id) => entities[id]);
});

export const getLessonActivities = createSelector(getActivitiesState, fromReducers.getLessonActivities);

export const getAllLessonActivities = createSelector(getLessonActivities, (entities) => {
  const acts = Object.keys(entities).map((id) => entities[id]);
  return acts.sort((a, b) => a.order - b.order);
});
export const getLessonActivitiesErrors = createSelector(
  getActivitiesState,
  fromReducers.getLessonActivitiesErrors
);

export const getAllLessonActivitiesErrors = createSelector(getLessonActivitiesErrors, (entities) => {
  const acts = Object.keys(entities).map((id) => entities[id]);
  // return acts.sort((a, b) => a.order - b.order);
  // return acts;
  return entities;
});

export const getSelectedLessonActivity = createSelector(getActivitiesState, (state) => {
  return state.lessonActivities[state.selectedLessonActivity];
});

export const getSelectedPossibleActivity = createSelector(
  getActivitiesState,
  fromReducers.getSelectedPossibleActivity
);

export const getActivityThumbnail = (id) =>
  createSelector(getPossibleActivities, (entities) => {
    if (entities[id]) {
      return entities[id].thumbnail;
    } else {
      return '';
    }
  });

export const getLessonName = createSelector(getActivitiesState, fromReducers.getLessonName);
export const getLessonId = createSelector(getActivitiesState, fromReducers.getLessonId);
export const getLessonDescription = createSelector(getActivitiesState, fromReducers.getLessonDescription);

export const getErrorInLeson = createSelector(getActivitiesState, fromReducers.getErrorInLesson);

export const getSavingLesson = createSelector(getActivitiesState, fromReducers.getSavingLesson);

export const getLessonSaved = createSelector(getActivitiesState, fromReducers.getLessonSaved);

export const getActivitiesLoaded = createSelector(getActivitiesState, fromReducers.getActivitiesLoaded);

export const getActivitiesLoading = createSelector(getActivitiesState, fromReducers.getActivitiesLoading);

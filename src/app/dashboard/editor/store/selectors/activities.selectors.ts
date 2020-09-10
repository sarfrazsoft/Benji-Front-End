import { createSelector } from '@ngrx/store';
import * as fromActivities from '../reducers';
import * as fromPizzas from '../reducers/activities.reducers';

// activities state
export const getActivitiesState = createSelector(
  fromActivities.getEditorState,
  (state: fromActivities.EditorState) => state.activities
);

export const getPossibleActivities = createSelector(getActivitiesState, fromPizzas.getPossibleActivities);

export const getSelectedLessonActivityContent = createSelector(
  getActivitiesState,
  fromPizzas.getSelectedLessonActivityContent
);

export const getAllPossibleActivities = createSelector(getPossibleActivities, (entities) => {
  return Object.keys(entities).map((id) => entities[id]);
});

export const getLessonActivities = createSelector(getActivitiesState, fromPizzas.getLessonActivities);

export const getAllLessonActivities = createSelector(getLessonActivities, (entities) => {
  const acts = Object.keys(entities).map((id) => entities[parseInt(id, 10)]);
  return acts.sort((a, b) => a.order - b.order);
});

export const getSelectedLessonActivity = createSelector(getActivitiesState, (state) => {
  return state.lessonActivities[state.selectedLessonActivity];
});

export const getSelectedLessonActivityFields = createSelector(getSelectedLessonActivity, (activity) => {
  if (activity && activity.activity) {
    return Object.keys(activity.activity.fields).map((id) => {
      return { ...activity.activity.fields[id], id };
    });
  }
});

export const getActivitiesLoaded = createSelector(getActivitiesState, fromPizzas.getActivitiesLoaded);

export const getActivitiesLoading = createSelector(getActivitiesState, fromPizzas.getActivitiesLoading);

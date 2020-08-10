import { createSelector } from '@ngrx/store';
import * as fromActivities from '../reducers';
import * as fromPizzas from '../reducers/activities.reducers';

// activities state
export const getActivitiesState = createSelector(
  fromActivities.getEditorState,
  (state: fromActivities.EditorState) => state.activities
);

export const getActivitiesEntities = createSelector(
  getActivitiesState,
  fromPizzas.getActivitiesEntities
);

export const getPossibleActivitiesEntities = createSelector(
  getActivitiesState,
  fromPizzas.getPossibleActivitiesEntities
);

export const getAllActivities = createSelector(
  getActivitiesEntities,
  (entities) => {
    return Object.keys(entities).map((id) => entities[parseInt(id, 10)]);
  }
);

export const getAllPossibleActivities = createSelector(
  getPossibleActivitiesEntities,
  (categories) => {
    return Object.keys(categories).map((id) => {
      const category = categories[parseInt(id, 10)];
      const newacts = Object.keys(category.activities).map((activityId) => {
        return category.activities[parseInt(activityId, 10)];
      });
      return {
        ...category,
        activities: newacts,
      };

      // return category;
      // return categories[parseInt(id, 10)];
    });
  }
);

export const getActivitiesLoaded = createSelector(
  getActivitiesState,
  fromPizzas.getActivitiesLoaded
);

export const getActivitiesLoading = createSelector(
  getActivitiesState,
  fromPizzas.getActivitiesLoading
);

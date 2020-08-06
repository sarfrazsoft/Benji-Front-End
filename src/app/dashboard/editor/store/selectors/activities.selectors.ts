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

export const getAllActivities = createSelector(
  getActivitiesEntities,
  (entities) => {
    return Object.keys(entities).map((id) => entities[parseInt(id, 10)]);
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

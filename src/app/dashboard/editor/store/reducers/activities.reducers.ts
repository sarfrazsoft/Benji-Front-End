import { SAMPLE_ACTIVITIES } from '../../models';
import { Activity } from '../../models/activity.model';
import * as fromActivities from '../actions/activities.action';

export interface ActivityState {
  entities: { [id: number]: Activity };
  loaded: boolean;
  loading: boolean;
}

export const initialState = {
  entities: {},
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromActivities.ActivitiesAction
): ActivityState {
  switch (action.type) {
    case fromActivities.LOAD_ACTIVITIES: {
      return { ...state, loading: true };
    }
    case fromActivities.LOAD_ACTIVITIES_SUCCESS: {
      const data = action.payload;

      const flattendObjects = data.reduce(
        (entities: { [id: number]: Activity }, activity: Activity) => {
          return {
            ...entities,
            [activity.id]: activity,
          };
        },
        {
          ...state.entities,
        }
      );

      return {
        ...state,
        loading: false,
        loaded: true,
        entities: flattendObjects,
      };
    }
    case fromActivities.LOAD_ACTIVITIES_FAIL: {
      return { ...state, loading: false, loaded: false };
    }

    case fromActivities.ADD_PLACEHOLDER_ACTIVITY: {
      return { ...state };
    }

    case fromActivities.REMOVE_PLACEHOLDER_ACTIVITY: {
      const entities = {};
      return {
        ...state,
        entities,
      };
    }
  }
  return state;
}

export const getActivitiesLoading = (state: ActivityState) => state.loading;
export const getActivitiesLoaded = (state: ActivityState) => state.loaded;
export const getActivitiesEntities = (state: ActivityState) => state.entities;

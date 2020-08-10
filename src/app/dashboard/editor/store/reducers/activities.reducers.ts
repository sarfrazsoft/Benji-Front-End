import { SAMPLE_ACTIVITIES } from '../../models';
import { Activity } from '../../models/activity.model';
import * as fromActivities from '../actions/activities.action';

export interface ActivityState {
  entities: { [id: number]: Activity };
  loaded: boolean;
  loading: boolean;
  possibleActivities: { [id: number]: any };
}

export const initialState = {
  entities: {},
  loaded: false,
  loading: false,
  possibleActivities: {
    1: {
      id: 1,
      type: 'Popular question types',
      activities: {
        1: { displayName: 'Multiple Choice', id: 1, mouseOvered: false },
        2: { displayName: 'Scales', id: 2, mouseOvered: false },
        3: { displayName: 'Q&A', id: 3, mouseOvered: false },
        4: { displayName: 'Ranking', id: 4, mouseOvered: false },
        5: { displayName: 'Type Answer', id: 5, mouseOvered: false },
      },
    },
    2: {
      id: 2,
      type: 'Quiz Competition',
      activities: {
        6: { displayName: 'Multiple Choice', id: 6, mouseOvered: false },
        7: { displayName: 'Scales', id: 7, mouseOvered: false },
      },
    },
    3: {
      id: 3,
      type: 'Content Sliders',
      activities: {
        8: { displayName: 'Heading', id: 8, mouseOvered: false },
        9: { displayName: 'Paragraph', id: 9, mouseOvered: false },
        10: { displayName: 'Image slide', id: 10, mouseOvered: false },
        11: { displayName: 'Big', id: 11, mouseOvered: false },
      },
    },
  },
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
      const placeholder = [
        {
          name: '',
          id: 999999999,
          activity_type: 'new type',
        },
      ];
      const flattendObjects = placeholder.reduce(
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
      return { ...state };
    }

    case fromActivities.REMOVE_PLACEHOLDER_ACTIVITY: {
      const entities = {};
      return {
        ...state,
        entities,
      };
    }

    case fromActivities.ACTIVITY_HOVERED: {
      const activityId = action.payload.activityId;
      const categoryId = action.payload.categoryId;
      const newActivity = Object.assign(
        {},
        state.possibleActivities[categoryId].activities[activityId]
      );
      newActivity.mouseOvered = true;
      return {
        ...state,
        possibleActivities: {
          ...state.possibleActivities,
          [categoryId]: {
            ...state.possibleActivities[categoryId],
            activities: {
              ...state.possibleActivities[categoryId].activities,
              [activityId]: newActivity,
            },
          },
        },
      };
      // return PA;
    }
  }
  return state;
}

export const getActivitiesLoading = (state: ActivityState) => state.loading;
export const getActivitiesLoaded = (state: ActivityState) => state.loaded;
export const getActivitiesEntities = (state: ActivityState) => state.entities;
export const getPossibleActivitiesEntities = (state: ActivityState) =>
  state.possibleActivities;

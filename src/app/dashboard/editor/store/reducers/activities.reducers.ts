import { SAMPLE_ACTIVITIES } from '../../models';
import { Activity } from '../../models/activity.model';
import * as fromActivities from '../actions/activities.action';

export interface ActivityState {
  // holds all possible activities that can be
  // added to the course
  possibleActivities: { [id: string]: any };
  // id of the selected possible activity
  selectedPossibleActivity: number;

  // holds the activities created in the lesson
  lessonActivities: { [id: number]: any };
  // id of the selected lesson activity
  selectedLessonActivity: number;
  loaded: boolean;
  loading: boolean;
}

export const initialState = {
  possibleActivities: {},
  selectedPossibleActivity: null,
  lessonActivities: {},
  selectedLessonActivity: null,
  loaded: false,
  loading: false,
};

export function reducer(state = initialState, action: fromActivities.ActivitiesAction): ActivityState {
  switch (action.type) {
    // reducers to load all possible activities
    case fromActivities.LOAD_ALL_POSSIBLE_ACTIVITIES: {
      return { ...state, loading: true };
    }
    case fromActivities.LOAD_ALL_POSSIBLE_ACTIVITIES_SUCCESS: {
      const activities = action.payload;
      let i = 0;
      const arr = [];
      for (const key in activities) {
        if (activities.hasOwnProperty(key)) {
          const actProperties = activities[key];

          const x = {
            fields: actProperties.fields,
            id: key,
            displayName: key,
            thumbnail: actProperties.thumbnail,
          };
          arr.push(x);
          i++;
        }
      }

      const flattendObjects = arr.reduce(
        (entities: { [id: number]: Activity }, activity: Activity) => {
          return {
            ...entities,
            [activity.id]: activity,
          };
        },
        {
          ...state.possibleActivities,
        }
      );

      return {
        ...state,
        loading: false,
        loaded: true,
        possibleActivities: flattendObjects,
      };
    }
    case fromActivities.LOAD_ALL_POSSIBLE_ACTIVITIES_FAIL: {
      return { ...state, loading: false, loaded: false };
    }

    // reducers to load lesson's activities
    case fromActivities.LOAD_LESSON_ACTIVITIES: {
      return { ...state, loading: true };
    }
    case fromActivities.LOAD_LESSON_ACTIVITIES_SUCCESS: {
      const activities = action.payload;
      return {
        ...state,
        loading: false,
        loaded: true,
        lessonActivities: {},
      };
    }
    case fromActivities.LOAD_LESSON_ACTIVITIES_FAIL: {
      return { ...state, loading: false, loaded: false };
    }

    case fromActivities.SELECT_ACTIVITY_TYPE: {
      const activityId = action.payload;
      const activity = state.possibleActivities[activityId];
      let lessonActivity = {};
      if (state.selectedLessonActivity) {
        const x = state.selectedLessonActivity;
        lessonActivity = {
          ...state.lessonActivities[x],
          activity,
        };
      }
      return {
        ...state,
        lessonActivities: {
          ...state.lessonActivities,
          [state.selectedLessonActivity]: lessonActivity,
        },
      };
      break;
    }

    case fromActivities.ADD_ACTIVITY_CONTENT: {
      const content = action.payload;
      let lessonActivity = {};
      if (state.selectedLessonActivity) {
        const x = state.selectedLessonActivity;
        lessonActivity = {
          ...state.lessonActivities[x],
          content,
        };
      }
      return {
        ...state,
        lessonActivities: {
          ...state.lessonActivities,
          [state.selectedLessonActivity]: lessonActivity,
        },
      };
    }

    case fromActivities.ADD_EMPTY_LESSON_ACTIVITY: {
      const newIndex = new Date().getTime();
      const noOfActivities = Object.keys(state.lessonActivities).length;

      const lessonActivities = {
        ...state.lessonActivities,
        [newIndex]: { id: newIndex, empty: true, selected: false, order: noOfActivities + 1 },
      };

      return {
        ...state,
        lessonActivities,
      };
    }

    case fromActivities.REMOVE_LESSON_ACTIVITY: {
      const index = action.payload;
      const y = index + '';
      const { [index]: removed, ...lessonActivities }: any = state.lessonActivities;

      return {
        ...state,
        lessonActivities,
      };
    }

    case fromActivities.REORDER_LESSON_ACTIVITIES: {
      const newOrderActs = action.payload;
      const orderedActs = [];
      for (let i = 0; i < newOrderActs.length; i++) {
        orderedActs.push({ ...newOrderActs[i], order: i + 1 });
      }

      const flattendObjects = orderedActs.reduce(
        (entities: { [id: number]: Activity }, activity: Activity) => {
          return {
            ...entities,
            [activity.id]: activity,
          };
        },
        {
          ...state.lessonActivities,
        }
      );

      return {
        ...state,
        loading: false,
        loaded: true,
        lessonActivities: flattendObjects,
      };
    }

    case fromActivities.SELECT_LESSON_ACTIVITY: {
      const id = action.payload;
      let lessonActivities = {
        ...state.lessonActivities,
        [id]: { ...state.lessonActivities[id], selected: true },
      };
      const selectedID = state.selectedLessonActivity;
      if (selectedID && selectedID !== id) {
        lessonActivities = {
          ...lessonActivities,
          [selectedID]: { ...lessonActivities[selectedID], selected: false },
        };
      }

      return {
        ...state,
        lessonActivities,
        selectedLessonActivity: id,
      };
    }
  }

  return state;
}

export const getActivitiesLoading = (state: ActivityState) => state.loading;
export const getActivitiesLoaded = (state: ActivityState) => state.loaded;
export const getPossibleActivities = (state: ActivityState) => state.possibleActivities;
export const getLessonActivities = (state: ActivityState) => state.lessonActivities;
export const getSelectedLessonActivity = (state: ActivityState) => state.selectedLessonActivity;

// case fromActivities.ADD_PLACEHOLDER_ACTIVITY: {
//   const placeholder = [
//     {
//       name: '',
//       id: 999999999,
//       activity_type: 'new type',
//     },
//   ];
//   const flattendObjects = placeholder.reduce(
//     (entities: { [id: number]: Activity }, activity: Activity) => {
//       return {
//         ...entities,
//         [activity.id]: activity,
//       };
//     },
//     {
//       ...state.entities,
//     }
//   );

//   return {
//     ...state,
//     loading: false,
//     loaded: true,
//     entities: flattendObjects,
//   };
//   return { ...state };
// }

// case fromActivities.REMOVE_PLACEHOLDER_ACTIVITY: {
//   const entities = {};
//   return {
//     ...state,
//     entities,
//   };
// }

// case fromActivities.ACTIVITY_HOVERED: {
//   const activityId = action.payload.activityId;
//   const categoryId = action.payload.categoryId;
//   const newActivity = Object.assign(
//     {},
//     state.possibleActivities[categoryId].activities[activityId]
//   );
//   newActivity.mouseOvered = true;
//   return {
//     ...state,
//     possibleActivities: {
//       ...state.possibleActivities,
//       [categoryId]: {
//         ...state.possibleActivities[categoryId],
//         activities: {
//           ...state.possibleActivities[categoryId].activities,
//           [activityId]: newActivity,
//         },
//       },
//     },
//   };
// }

// case fromActivities.ACTIVITY_HOVER_END: {
//   const activityId = action.payload.activityId;
//   const categoryId = action.payload.categoryId;
//   const newActivity = Object.assign(
//     {},
//     state.possibleActivities[categoryId].activities[activityId]
//   );
//   newActivity.mouseOvered = false;
//   return {
//     ...state,
//     possibleActivities: {
//       ...state.possibleActivities,
//       [categoryId]: {
//         ...state.possibleActivities[categoryId],
//         activities: {
//           ...state.possibleActivities[categoryId].activities,
//           [activityId]: newActivity,
//         },
//       },
//     },
//   };
// }

// const array = action.payload.arr;
// const from = clamp(action.payload.previousIndex, array.length - 1);
// const to = clamp(action.payload.currentIndex, array.length - 1);

// if (from === to) {
//   return;
// }

// const target = array[from];
// const delta = to < from ? -1 : 1;

// for (let i = from; i !== to; i += delta) {
//   array[i] = array[i + delta];
// }

// array[to] = target;

// console.log(array);

// const orderedActs = [];
// for (let i = 0; i < orderedActs.length; i++) {
//   orderedActs.push({ order: i + 1, ...array[i] });
//   console.log({ order: i + 1, ...array[i] });
// }

// const flattendObjects = orderedActs.reduce(
//   (entities: { [id: number]: Activity }, activity: Activity) => {
//     return {
//       ...entities,
//       [activity.id]: activity,
//     };
//   },
//   {
//     ...state.lessonActivities,
//   }
// );

// return {
//   ...state,
//   loading: false,
//   loaded: true,
//   lessonActivities: flattendObjects,
// };

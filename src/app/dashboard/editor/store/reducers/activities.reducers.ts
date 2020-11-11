import { cloneDeep, orderBy } from 'lodash';
import { OverviewLessonActivity } from 'src/app/services/backend/schema';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { SAMPLE_ACTIVITIES } from '../../models';
import { Activity } from '../../models/activity.model';
import * as fromActivities from '../actions/activities.action';

export interface ActivityState {
  // holds all possible activities that can be
  // added to the course
  possibleActivities: { [id: string]: any };
  // id of the selected possible activity
  selectedPossibleActivity: string;

  // holds the activities created in the lesson
  lessonActivities: { [id: number]: OverviewLessonActivity };
  // holds the activities' content
  lessonActivitiesContent: { [id: number]: any };
  // id of the selected lesson activity
  selectedLessonActivity: number;
  // id of the selected lesson activity
  selectedLessonActivityContent: {};

  // exclude these activities from all possible activities
  excludedActivities: Array<any>;

  loadedPossibleActivities: boolean;
  loadingPossibleActivities: boolean;
  loadedLessonActivities: boolean;
  loadingLessonActivities: boolean;
  savingLesson: boolean;
  lessonSaved: boolean;

  lessonId: number;
  lessonName: string;
  lessonDescription: string;
  errorInLesson: boolean;
}

export const initialState = {
  lessonId: null,
  lessonName: null,
  lessonDescription: null,
  errorInLesson: false,
  possibleActivities: {},
  selectedPossibleActivity: null,
  lessonActivities: {},
  lessonActivitiesContent: {},
  selectedLessonActivity: null,
  selectedLessonActivityContent: null,
  excludedActivities: [
    'LobbyActivity',
    'GatherActivity',
    'HintWordActivity',
    'WhereDoYouStandActivity',
    'RoleplayPairActivity',
    'DiscussionActivity',
    'GroupingActivity',
    'PairGroupingActivity',
    'TriadGroupingActivity',
    'ExternalGroupingActivity',
    'PitchoMaticActivity',
    'MCQResultsActivity',
    'MontyHallActivity',
    'SingleGroupingActivity',
    'ImageActivity',
  ],
  loadedPossibleActivities: false,
  loadingPossibleActivities: false,
  loadedLessonActivities: false,
  loadingLessonActivities: false,
  savingLesson: false,
  lessonSaved: false,
};

export const ActivityDisplayNames = {
  BrainstormActivity: 'Brainstorm',
  TitleActivity: 'Slides',
  VideoActivity: 'Video',
  CaseStudyActivity: 'Worksheets',
  MCQActivity: 'Quiz',
  FeedbackActivity: 'Survey',
  GenericRoleplayActivity: 'Roleplay',
};

export function reducer(state = initialState, action: fromActivities.ActivitiesAction): ActivityState {
  switch (action.type) {
    // reducers to load all possible activities
    case fromActivities.LOAD_ALL_POSSIBLE_ACTIVITIES: {
      return { ...state, loadingPossibleActivities: true };
    }
    case fromActivities.LOAD_ALL_POSSIBLE_ACTIVITIES_SUCCESS: {
      const activities = action.payload;
      const arr = [];
      for (const key in activities) {
        if (activities.hasOwnProperty(key)) {
          if (!state.excludedActivities.includes(key)) {
            const actProperties = activities[key];
            const x = {
              schema: {
                ...actProperties,
              },
              id: key,
              displayName: ActivityDisplayNames[key],
              activity_type: key,
              thumbnail: actProperties.thumbnail,
            };
            arr.push(x);
          }
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
        loadingPossibleActivities: false,
        loadedPossibleActivities: true,
        possibleActivities: flattendObjects,
      };
    }
    case fromActivities.LOAD_ALL_POSSIBLE_ACTIVITIES_FAIL: {
      return { ...state, loadingPossibleActivities: false, loadedPossibleActivities: false };
    }

    // reducers to load lesson's activities
    case fromActivities.LOAD_LESSON_ACTIVITIES: {
      return { ...state, loadingLessonActivities: true, loadedLessonActivities: false };
    }
    case fromActivities.LOAD_LESSON_ACTIVITIES_SUCCESS: {
      const lesson: Lesson = action.payload;

      const lessonActivities: { [id: number]: OverviewLessonActivity } = {};
      const lessonActivitiesContent = {};
      let selectedLessonActivity = null;
      let selectedLessonActivityContent = null;
      let selectedPossibleActivity = null;

      let acts = lesson.lesson_plan_json;
      if (!lesson.lesson_plan_json && lesson.editor_lesson_plan) {
        acts = lesson.editor_lesson_plan;
      }
      if (acts) {
        acts = acts.filter(
          (val) =>
            val.activity_type !== 'ExternalGroupingActivity' &&
            val.activity_type !== 'SingleGroupingActivity' &&
            val.activity_type !== 'MCQResultsActivity'
        );
        acts.forEach((val, i) => {
          // console.log(val);
          let selected = false;
          if (i === 0) {
            selected = true;
            selectedLessonActivity = val.activity_id;
            selectedLessonActivityContent = val;
            selectedPossibleActivity = val.activity_type;
          }
          const la: OverviewLessonActivity = {
            id: parseInt(val.activity_id, 10),
            selected: selected,
            empty: false,
            order: i + 1,
            activity_type: val.activity_type,
            displayName: ActivityDisplayNames[val.activity_type],
          };
          lessonActivities[val.activity_id] = la;
        });

        acts.forEach((val) => {
          lessonActivitiesContent[val.activity_id] = val;
        });
      }

      return {
        ...state,
        lessonName: lesson.lesson_name,
        lessonId: lesson.id,
        lessonDescription: lesson.lesson_description,
        loadingLessonActivities: false,
        loadedLessonActivities: true,
        lessonActivities: lessonActivities,
        lessonActivitiesContent: lessonActivitiesContent,
        selectedPossibleActivity: selectedPossibleActivity,
        selectedLessonActivityContent: selectedLessonActivityContent,
        selectedLessonActivity: selectedLessonActivity,
      };
    }
    case fromActivities.LOAD_LESSON_ACTIVITIES_FAIL: {
      return { ...state, loadingLessonActivities: false, loadedLessonActivities: false };
    }

    case fromActivities.SELECT_ACTIVITY_TYPE: {
      const activity_type = action.payload;
      const activity = state.possibleActivities[activity_type];
      let lessonActivity = {};
      if (state.selectedLessonActivity) {
        const x = state.selectedLessonActivity;

        const la: OverviewLessonActivity = {
          ...state.lessonActivities[x],
          empty: false,
          activity_type: activity.id,
          displayName: ActivityDisplayNames[activity.activity_type],
        };
        lessonActivity = la;
      }

      if (state.selectedLessonActivityContent) {
      }
      return {
        ...state,
        selectedPossibleActivity: activity_type + '',
        lessonActivities: {
          ...state.lessonActivities,
          [state.selectedLessonActivity]: lessonActivity,
        },
        selectedLessonActivityContent: {},
        lessonActivitiesContent: {
          ...state.lessonActivitiesContent,
          [state.selectedLessonActivity]: {},
        },
      };
      break;
    }

    case fromActivities.ADD_ACTIVITY_CONTENT: {
      const content = action.payload;
      return {
        ...state,
        lessonActivitiesContent: {
          ...state.lessonActivitiesContent,
          [state.selectedLessonActivity]: content,
        },
        selectedLessonActivityContent: content,
        savingLesson: true,
        lessonSaved: false,
      };
    }

    case fromActivities.ADD_EMPTY_LESSON_ACTIVITY: {
      // Creating the new lesson activity and adding to existing
      const newIndex = new Date().getTime();
      const noOfActivities = Object.keys(state.lessonActivities).length;
      let lessonActivities = {
        ...state.lessonActivities,
        [newIndex]: {
          id: newIndex,
          empty: true,
          selected: true,
          order: noOfActivities + 1,
          activity_type: null,
          displayName: null,
        },
      };

      // Selecting the new lesson activity and unselect the previous selected activity
      const previousSelectedId = state.selectedLessonActivity;
      if (previousSelectedId && previousSelectedId !== newIndex) {
        lessonActivities = {
          ...lessonActivities,
          [previousSelectedId]: { ...lessonActivities[previousSelectedId], selected: false },
        };
      }
      return {
        ...state,
        lessonActivities,
        selectedLessonActivity: newIndex,
        selectedPossibleActivity: null,
      };
    }

    case fromActivities.ADD_EMPTY_LESSON_ACTIVITY_AT_INDEX: {
      // Creating the new lesson activity and adding to existing
      // lesson activities at the specified index
      const order = action.payload;
      const newIndex = new Date().getTime();

      // make an array out of the lesson activities
      // insert our new activity at the secified index
      // flatten the object again
      const arrayLessonActivities2 = [];
      Object.keys(state.lessonActivities).forEach((key) => {
        arrayLessonActivities2.push(state.lessonActivities[key]);
      });
      let arrayLessonActivities = cloneDeep(arrayLessonActivities2);
      arrayLessonActivities = orderBy(arrayLessonActivities, ['order'], ['asc']);
      // console.log(cloneDeep(arrayLessonActivities));
      arrayLessonActivities.forEach((element) => {
        if (element.order >= order) {
          element.order = order + 1;
        }
      });
      arrayLessonActivities.splice(order, 0, {
        id: newIndex,
        empty: true,
        selected: false,
        order: order,
        activity_type: null,
        displayName: null,
      });
      arrayLessonActivities.forEach((val, index) => {
        arrayLessonActivities[index] = { ...val, order: index + 1 };
      });
      console.log(arrayLessonActivities);

      let lessonActivities = arrayLessonActivities.reduce(
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

      // Selecting the new lesson activity and unselect the previous selected activity
      const previousSelectedId = state.selectedLessonActivity;
      if (previousSelectedId && previousSelectedId !== newIndex) {
        lessonActivities = {
          ...lessonActivities,
          [previousSelectedId]: { ...lessonActivities[previousSelectedId], selected: false },
        };
      }
      return {
        ...state,
        lessonActivities,
        selectedLessonActivity: newIndex,
        selectedPossibleActivity: null,
      };
    }

    case fromActivities.REMOVE_LESSON_ACTIVITY: {
      const index = action.payload;
      let selectedLessonActivity = state.selectedLessonActivity;
      let selectedLessonActivityContent = state.selectedLessonActivityContent;
      if (index === state.selectedLessonActivity) {
        selectedLessonActivity = null;
        selectedLessonActivityContent = null;
        // select the last activity in the lesson
        const removedActivity = state.lessonActivities[index];
        const orderArray = [];
        Object.keys(state.lessonActivities).forEach((key) => {
          if (removedActivity.order !== state.lessonActivities[key].order) {
            orderArray.push(state.lessonActivities[key].order);
          }
        });
        orderArray.sort((a, b) => a - b);

        const nextSelectedActivityOrder = orderArray[orderArray.length - 1];
        let nextSelectedActivity = null;
        Object.keys(state.lessonActivities).forEach((key) => {
          if (state.lessonActivities[key].order === nextSelectedActivityOrder) {
            nextSelectedActivity = state.lessonActivities[key];
          }
        });
        selectedLessonActivity = nextSelectedActivity.id;
        selectedLessonActivityContent = state.lessonActivitiesContent[nextSelectedActivity.id];
        console.log(nextSelectedActivityOrder);
      }

      const noOfActivities = Object.keys(state.lessonActivities).length;

      if (noOfActivities > 1) {
        const { [index]: removed, ...lessonActivities }: any = state.lessonActivities;
        // fix the order of the activities
        const arrayLessonActivities2 = [];
        Object.keys(lessonActivities).forEach((key) => {
          arrayLessonActivities2.push(lessonActivities[key]);
        });
        const arrayLessonActivities = cloneDeep(arrayLessonActivities2);
        arrayLessonActivities.forEach((val, i) => {
          arrayLessonActivities[i] = { ...val, order: i + 1 };
        });

        const la = {};
        arrayLessonActivities.forEach((val) => {
          la[val.id] = val;
        });

        return {
          ...state,
          selectedLessonActivity,
          selectedLessonActivityContent,
          lessonActivities: {
            ...la,
            [selectedLessonActivity]: { selected: true, ...la[selectedLessonActivity] },
          },
        };
      } else {
        return {
          ...state,
        };
      }
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
        selectedPossibleActivity: state.lessonActivities[id].activity_type,
        selectedLessonActivity: id,
        selectedLessonActivityContent: state.lessonActivitiesContent[id],
      };
    }

    case fromActivities.COPY_LESSON_ACTIVITY: {
      const activity: OverviewLessonActivity = action.payload;

      return {
        ...state,
      };
    }

    case fromActivities.UPDATE_LESSON_NAME_SUCCESS: {
      const lesson: Lesson = action.payload;
      return { ...state, lessonName: lesson.lesson_name };
    }

    case fromActivities.UPDATE_LESSON_NAME_FAILURE: {
      const error = action.payload;
      console.log(error);
      return { ...state };
    }

    case fromActivities.SAVE_LESSON_SUCCESS: {
      const lesson: Lesson = action.payload;
      let lessonError = false;
      if (!lesson.lesson_plan && !lesson.lesson_plan_json && lesson.editor_lesson_plan) {
        lessonError = true;
      }
      return { ...state, errorInLesson: lessonError, lessonSaved: true, savingLesson: false };
    }
    case fromActivities.SAVE_LESSON_FAILURE: {
      const error = action.payload;
      console.log(error);
      return { ...state };
    }
  }

  return state;
}

export const getLessonName = (state: ActivityState) => state.lessonName;
export const getErrorInLesson = (state: ActivityState) => state.errorInLesson;
export const getActivitiesLoading = (state: ActivityState) => state.loadingLessonActivities;
export const getActivitiesLoaded = (state: ActivityState) => state.loadedLessonActivities;
export const getSavingLesson = (state: ActivityState) => state.savingLesson;
export const getLessonSaved = (state: ActivityState) => state.lessonSaved;
export const getPossibleActivities = (state: ActivityState) => state.possibleActivities;
export const getSelectedPossibleActivity = (state: ActivityState) => state.selectedPossibleActivity;
export const getLessonActivities = (state: ActivityState) => state.lessonActivities;
export const getSelectedLessonActivity = (state: ActivityState) => state.selectedLessonActivity;
export const getSelectedLessonActivityContent = (state: ActivityState) => state.selectedLessonActivityContent;

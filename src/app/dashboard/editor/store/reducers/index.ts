import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromActivities from './activities.reducers';

export interface EditorState {
  activities: fromActivities.ActivityState;
}

export const reducers: ActionReducerMap<EditorState> = {
  activities: fromActivities.reducer,
};

export const getEditorState = createFeatureSelector<EditorState>('editor');

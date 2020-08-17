export interface Activity {
  name: string;
  id: number;
  activity_type: string;
}

export const SAMPLE_ACTIVITIES = [];
export const SAMPLE_ACTIVITIES2 = [
  { name: 'mcq activity', id: 1, activity_type: 'activity type 1' },
  { name: 'brainstrom activity', id: 2, activity_type: 'activity type 2' },
  { name: 'title activity', id: 3, activity_type: 'activity type 2' },
];

export enum FieldTypes {
  string = 'str',
}

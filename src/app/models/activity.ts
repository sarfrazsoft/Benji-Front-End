import { User } from '../models/user';

export interface Activity {
  id: number;
  session: number;
  activity_num: number;
  title: string;
  description: string;
  activity_hint: string;
  titleactivity: object;
  mcqactivity: object;
  thinkpairshareactivity: object;
  rolediscussionactivity: object;
  videoactivity: object;
  textqactivity: object;
  ratingqactivity: object;
  feedbackactivity: object;
}

export interface ActivityRunParam {
  param_name: string;
  param_value: string;
}

export interface ActivityRun {
  id: number;
  activityrunuser_set: User[];
  activity_groups: User[][];
  activity_roles: object;
  activityrunparam_set: ActivityRunParam[];
  start_time: string;
  end_time: string;
}

export interface CurrentActivityStatus {
  current_activity: Activity;
  current_activityrun: ActivityRun;
  joined_users: User[];
  missing_users: User[];
  started: boolean;
}


// V2

export interface ActivityStatus {
    activity_type: string;
    activity_id: string;
    title: string;
    countdown_time?: any;
}

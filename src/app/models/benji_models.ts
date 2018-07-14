
export class User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export class Activity {
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

export class ActivityRunParam {
  param_name: string;
  param_value: string;
}

export class ActivityRun {
  id: number;
  activityrunuser_set: User[];
  activity_groups: User[][];
  activity_roles: object;
  activityrunparam_set: ActivityRunParam[];
  start_time: string;
  end_time: string;
}

export class CurrentActivityStatus {
  current_activity: Activity;
  current_activityrun: ActivityRun;
  joined_users: User[];
  missing_users: User[];
  started: boolean;
}

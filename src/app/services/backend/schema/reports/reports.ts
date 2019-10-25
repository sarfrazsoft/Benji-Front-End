import { ActivityTypes } from 'src/app/globals';
import { PitchoMaticBlank, PitchoMaticGroupMemberPitch } from '../activities';
import { User } from '../user';
import { FeedbackQuestion, TitleComponent } from '../utils';

export interface SessionReport {
  id: number;
  start_time: string;
  end_time: string;
  lessonrun_code: number;
  joined_users: Array<User>;
  host: User;
  activity_results: Array<any>;
}

export interface Report {
  activity_type: ActivityTypes;
  id: number;
}

export interface VideoReport extends Report {
  length: number;
}

export interface LobbyReport extends Report {
  length: number;
}

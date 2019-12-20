import { ActivityTypes } from 'src/app/globals';
import { User } from '../user';
import { BuildAPitchReport } from './build-a-pitch';
import { FeedbackReport } from './feedback';
import { MCQReport } from './MCQ';
import { PitchOMaticReport } from './pitch-o-matic';

export interface SessionReport {
  id: number;
  start_time: string;
  end_time: string;
  lessonrun_code: number;
  joined_users: Array<User>;
  host: User;
  activity_results: Array<
    BuildAPitchReport | FeedbackReport | MCQReport | PitchOMaticReport
  >;
}

export interface ActivityReport extends SessionReport {
  activity_type?: ActivityTypes;
  title?: string;
  mcqs?: Array<MCQReport>;
  feedback?: FeedbackReport;
  pom?: PitchOMaticReport;
  bap?: BuildAPitchReport;
  brainstorm?: any;
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

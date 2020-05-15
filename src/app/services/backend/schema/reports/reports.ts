import { ActivityTypes } from 'src/app/globals';
import { Lesson } from '../course_details';
import { User } from '../user';
import { BrainstormReport } from './brainstorm';
import { BuildAPitchReport } from './build-a-pitch';
import { FeedbackReport } from './feedback';
import { GenericRoleplayReport } from './generic-roleplay';
import { MCQReport } from './MCQ';
import { PitchOMaticReport } from './pitch-o-matic';

export interface SessionReport {
  id: number;
  start_time: string;
  lesson: Lesson;
  end_time: string;
  lessonrun_code: number;
  joined_users: Array<User>;
  host: User;
  activity_results: Array<
    | BuildAPitchReport
    | FeedbackReport
    | MCQReport
    | PitchOMaticReport
    | BrainstormReport
  >;
}

export interface ActivityReport extends SessionReport {
  activity_type?: ActivityTypes;
  title?: string;
  mcqs?: Array<MCQReport>;
  feedback?: FeedbackReport;
  pom?: PitchOMaticReport;
  bap?: BuildAPitchReport;
  brainstorm?: BrainstormReport;
  postAssessment?: FeedbackReport;
  grplay?: GenericRoleplayReport;
}

export interface Report {
  activity_type: ActivityTypes;
  id: number;
  title?: string;
}

export interface VideoReport extends Report {
  length: number;
}

export interface LobbyReport extends Report {
  length: number;
}

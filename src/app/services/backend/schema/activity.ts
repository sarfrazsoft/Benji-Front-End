import { User } from './user';
import { Course, Lesson, LessonRun } from './course_details';


// TODO: Breakup into individual interfaces - figure out inheritance etc
export interface ActivityStatus {
  activity_type: string;
  activity_id: string;
  title: string;
  next_activity_countdown: string;  // time?

  // RoleplayActivity Fields
  roleplay_question?: string;
  primary_role?: Role;
  secondary_role?: Role;
  activity_timer?: string;
  user_groups?: RoleplayUserGroup[];
  user_pairs_found?: number[];
  groups_found?: any;
  all_pairs_found?: boolean;
  user_discussions_complete?: User[];
  all_discussions_complete?: boolean;
  countdown_pair?: string;   // time?
  countdown_discussion?: string;   // time?

  // Discussion Activity
  discussion_countdown_time?: string; // time?
  discussion_complete?: boolean;
  instructions?: string;
  sharers?: number[];
  selected_sharers?: RoleplayUserGroup[];
  sharer_countdown_time?: string; // time?
  sharer_group_num?: number;
  sharer_group?: RoleplayUserGroup;

  // Teletrivia
  secret_phrase?: string;
  distracting_questions?: MCQuestion[];
  chosen_user?: User;
  circle_countdown?: string; // Time?
  users_in_circle?: User[];
  all_in_circle?: boolean;
  game_started?: boolean;
  sharing_started?: boolean;
  leaderboard?: LeaderboardRecord[];
  user_answers?: UserAnswer[];

  // Hintword:
  // instructions?: string; Already exists!
  submission_complete?: boolean;
  voting_complete?: boolean;
  submission_countdown?: string;
  voting_countdown?: string;
  end_countdown?: string;
  submitted_words?: string[];
  submitted_users?: number[];
  submitted_votes?: any; // Need to convert to record format
  voted_users?: number[];
  voted_word?: string;

  // MCQ
  question?: MCQuestion;
  countdown_time?: string;
  pause_time?: string;
  num_answers_submitted?: number;

  // Video
  video_url?: string
}

export interface MCQuestion {
  id: number;
  question: string;
  choices: MCQChoice[];
}

export interface MCQChoice {
  id: number;
  choice_text: string;
  is_correct: boolean;
  explanation_text: string;
}

export interface UserAnswer {
  user_id: number;
  question_id: number;
  is_correct: boolean;
  submission_time: string; // Time?
}

export interface LeaderboardRecord {
  user: User;
  correct: number;
  incorrect: number;
}

export interface Role {
  role_name: string;
  role_emoji: string;
  role_instructions: string;
}

export interface RoleplayUserGroup {
  primary: number[];
  secondary: number[];
}

export interface ActivityFlowServerMessage {
  course?: Course;
  lesson?: Lesson;
  lesson_run?: LessonRun;
  participants: User[];
  your_identity?: User;
  activity_status: ActivityStatus;
}

export interface ActivityFlowFrame {
  type: string;
  message: ActivityFlowServerMessage;
}

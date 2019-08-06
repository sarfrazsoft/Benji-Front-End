import { User } from './user';
import {
  BuildAPitchBlank,
  BuildAPitchEntry,
  BuildAPitchPitch,
  FeedbackQuestion,
  MCQQuestion,
  Timer,
  TitleComponent
} from './utils';

export interface BaseActivity {
  activity_id: string;
  description: string;
  start_time: string;
  end_time: string;
  next_activity_delay_seconds: number;
  next_activity_start_timer: Timer;
  is_paused: boolean;
}

export interface LobbyActivity {
  lobby_text: string;
}

export interface TitleActivity {
  main_title: string;
  title_text: string;
  title_emoji: string; // To be deprecated. Do not use. Instead, parse emoji://xxxx from title_image
  title_image: string;
}

export interface MCQActivity {
  question: MCQQuestion;
  question_seconds: number;
  question_timer: Timer;
  answered_users: User[];
  all_users_answered: boolean;
}

export interface MCQResultsActivity {
  results_summary: UserScore[];
  total: number;
}

export interface UserScore {
  id: number;
  score: number;
}

export interface VideoActivity {
  video_url: string;
}

export interface LeaderBoardItem {
  user: User;
  correct: number;
  incorrect: number;
  total_questions: number;
}

export interface TeleTriviaActivity {
  secret_phrase: string;
  circle_wait_seconds: number;
  circle_countdown_timer: Timer;
  first_user_in_chain: User;
  questions: MCQQuestion[];
  circle_complete: boolean;
  game_started: boolean;
  sharing_started: boolean;
  leaderboard: LeaderBoardItem[];
  users_in_circle: User[];
}

export interface Role {
  name: string;
  emoji: string; // To be deprecated. Do not use. Instead, parse emoji://xxxx from image_url
  image_url: string;
  instructions: string;
}

export interface RoleplayPairUser {
  user: User;
  found: boolean;
  discussion_complete: boolean;
}

export interface RoleplayPair {
  primary_roleplayuser_set: RoleplayPairUser[];
  secondary_roleplayuser_set: RoleplayPairUser[];
  group_found: boolean;
}

export interface PairGroupingActivity {
  grouping_complete: boolean;
  grouping_countdown_timer: Timer;
  usergroup_set: UserGroupUserSet[];
}

export interface UserGroupUserSet {
  usergroupuser_set: RoleplayPairUser[];
}

export interface RoleplayPairActivity {
  roleplay_question: string;
  primary_role: Role;
  secondary_role: Role;
  skip_pairing: boolean;
  grouping_seconds: number;
  activity_seconds: number;
  grouping_countdown_timer: Timer;
  activity_countdown_timer: Timer;
  reverse_group_activity: number;
  all_pairs_found: boolean;
  all_discussions_complete: boolean;
  grouping_complete: boolean;
  discussion_complete: boolean;
  roleplaypair_set: RoleplayPair[];
}

export interface HintWordsAndVotes {
  id: number;
  word: string;
  votes: number;
}

export interface HintWordActivity {
  instructions: string;
  submission_seconds: number;
  voting_seconds: number;
  submission_countdown_timer: Timer;
  voting_countdown_timer: Timer;
  submission_complete: boolean;
  voting_complete: boolean;
  words_and_votes: HintWordsAndVotes[];
  voted_word_text: string;
  submitted_users: User[];
  voted_users: User[];
}

export interface DiscussionGroupMember {
  has_volunteered: boolean;
  user: User;
}

export interface DiscussionGroup {
  selected_for_sharing: boolean;
  sharing_countdown_timer: Timer;
  discussiongroupmember_set: DiscussionGroupMember[];
}

export interface DiscussionActivity {
  title: string;
  instructions: string;
  num_sharers: number;
  discussion_seconds: number;
  sharing_seconds: number;
  discussion_countdown_timer: Timer;
  discussion_complete: boolean;
  discussiongroup_set: DiscussionGroup[];
  currently_sharing_group: DiscussionGroup;
  next_sharing_group: DiscussionGroup;
}

export interface FeedbackActivity {
  id: number;
  feedbackquestion_set: FeedbackQuestion[];
  answered_users: User[];
  titlecomponent: TitleComponent;
}

export interface WhereDoYouStandChoice {
  id: number;
  choice_name: string;
  prediction_text: string;
  preference_text: string;
  choice_img_url: string;
  collective_name: string;
}

export interface WhereDoYouStandChoiceStats {
  id: number;
  choice_name: string;
  num_predictions: number;
  num_preferences: number;
}

export interface WhereDoYouStandUserAnswers {
  user: User;
  wheredoyoustandchoice: WhereDoYouStandChoice;
}

export interface WhereDoYouStandActivity {
  question_title: string;
  prediction_text: string;
  preference_text: string;
  left_choice: WhereDoYouStandChoice;
  right_choice: WhereDoYouStandChoice;
  prediction_seconds: number;
  preference_seconds: number;
  stand_on_side_seconds: number;
  prediction_countdown_timer: Timer;
  prediction_extra_time_complete: boolean;
  prediction_extra_countdown_timer: Timer;
  preference_countdown_timer: Timer;
  preference_extra_countdown_timer: Timer;
  preference_extra_time_complete: boolean;
  stand_on_side_countdown_timer: Timer;
  prediction_complete: boolean;
  preference_complete: boolean;
  standing_complete: boolean;
  user_predictions: WhereDoYouStandUserAnswers[];
  user_preferences: WhereDoYouStandUserAnswers[];
  choice_stats: WhereDoYouStandChoiceStats[];
}

export interface BuildAPitchActivity {
  build_countdown_timer: Timer;
  buildapitchblank_set: Array<BuildAPitchBlank>;
  buildapitchpitch_set: Array<BuildAPitchPitch>;
  building_done: boolean;
  instructions: string;
  share_start_user: User;
  sharing_done: boolean;
  vote_countdown_timer: Timer;
  votes: Array<{ id: number; num_votes: number }>;
  voting_done: boolean;
  winning_user: User;
}

export interface PitchoMaticActivity {
  instructions: string;
  activity_status: string; // = preparing, grouping, pitching+, feedback+
  prepare_timer: Timer;
  group_timer: Timer;
  pitch_timer: Timer;
  feedback_timer: Timer;
  discuss_timer: Timer;
  pitchomaticblank_set: PitchoMaticBlank[];
  pitchomaticgroup_set: PitchoMaticGroup[];
  feedbackquestion_set: FeedbackQuestion[];
}

export interface PitchoMaticBlank {
  id: number;
  order: number;
  label: string;
  pitchomaticblankchoice_set: PitchoMaticBlankChoice[];
}

export interface PitchoMaticBlankChoice {
  id: number;
  value: string;
}

export interface PitchoMaticGroup {
  group_emoji: string;
  pitchomaticgroupmember_set: PitchoMaticGroupMember[];
}

export interface PitchoMaticGroupMember {
  user: User;
  is_grouped: boolean;
  has_generated: boolean;
  has_prepared: boolean;
  feedback_count: number;
  pitch_status: string; // = waiting, pitching, feedback, done
  // states:
  // is_pitching=false, pitch_done=false := user never pitched yet
  // is_pitching=true, pitch_done=false := user is pitching
  // is_pitching=true, pitch_done=true := user is recieving feedback
  // is_pitching=false, pitch_done=true := user is done with their pitch and feedback
  // true when user is pitching. remains true while feedback for user is going on.
  // becomes false after feedback
  is_pitching: boolean;
  pitch_done: boolean; // becomes true after pitch is done.
  pitch_prep_text: string;
  pitch: PitchoMaticGroupMemberPitch;
}

export interface PitchoMaticGroupMemberPitch {
  pitchomaticgroupmemberpitchchoice_set: PitchoMaticGroupMemberPitchChoice[];
}

export interface PitchoMaticGroupMemberPitchChoice {
  pitchomaticblank: number; // is the PitchoMaticBlank.id. You will need to lookup
  choice: number; // is the PitchoMaticBlankChoice.id for that PitchoMaticBlank
}

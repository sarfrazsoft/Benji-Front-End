import { User } from './user';
import {
  BuildAPitchBlank,
  BuildAPitchEntry,
  BuildAPitchPitch,
  FeedbackQuestion,
  MCQQuestion,
  Timer,
  TitleComponent,
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
  hide_timer: boolean;
}

export interface MCQActivity {
  question: MCQQuestion;
  question_seconds: number;
  question_timer: Timer;
  answered_users: User[];
  all_users_answered: boolean;
  titlecomponent: TitleComponent;
  quiz_leaderboard: Array<{ id: number; score: number }>;
}

export interface MCQResultsActivity {
  choices_summary: Array<{ id: number; answer_count: number }>;
  poll_mode: boolean;
  question_list: MCQQuestion[];
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

export interface TriadRoleplayPairUser {
  user: User;
  found: boolean;
  id: number;
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

export interface ExternalGroupingActivity {
  grouping_complete: boolean;
  grouping_countdown_timer: Timer;
  usergroup_set: UserGroupSet[];
}

export interface UserGroupSet {
  id: number;
  group_num: number;
  usergroupuser_set: Array<{ id: number; user: User; found: boolean }>;
}

export interface TriadGroupingActivity {
  grouping_complete: boolean;
  grouping_countdown_timer: Timer;
  usergroup_set: TriadUserGroupUserSet[];
}

export interface UserGroupUserSet {
  usergroupuser_set: RoleplayPairUser[];
}

export interface TriadUserGroupUserSet {
  usergroupuser_set: TriadRoleplayPairUser[];
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
  notes: Array<{ answer: string; question: string }>;
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

export interface BrainstormActivity {
  idea_rankings: Array<IdeaRanking>;
  instructions: string;
  max_user_submissions: number;
  max_user_votes: number;
  submission_complete: boolean;
  submission_countdown_timer: Timer;
  submission_seconds: number;
  user_submission_counts: Array<{ id: number; count: number }>;
  user_vote_counts: any[];
  voting_complete: boolean;
  voting_countdown_timer: Timer;
  voting_seconds: number;
}

export interface IdeaRanking {
  id: number;
  submitted_by_user: User;
  idea: string;
  num_votes: number;
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

export interface GenericRoleplayActivity {
  activity_countdown_timer: Timer;
  activity_seconds: number;
  feedback_countdown_timer: Timer;
  feedback_seconds: number;
  activity_type: string;
  genericroleplayrole_set: Array<RoleplayRole>;
  genericroleplayuser_set: Array<RoleplayUser>;
  groups: Array<RoleplayGroups>;
}

export interface RoleplayRole {
  id: number;
  name: string;
  image_url: string;
  instructions: string;
  short_instruction: string;
  allow_multiple: boolean;
  feedbackquestions: Array<FeedbackQuestion>;
}

export interface RoleplayUser {
  benjiuser_id: number;
  role: number;
  discussion_complete: boolean;
  feedback_submitted: boolean;
}

export interface RoleplayGroups {
  id: number;
  usergroupuser_set: Array<RoleplayUserSet>;
}

export interface RoleplayUserSet {
  id: number;
  found: boolean;
  user: User;
}

export interface CaseStudyActivity {
  activity_title: string;
  activity_seconds: number;
  activity_countdown_timer: Timer;
  groups: Array<UserGroupSet>;
  casestudyuser_set: Array<CaseStudyUserSet>;
  casestudyquestion_set: Array<{ id: number; question_text: string }>;
  note_taker_instructions: string;
  participant_instructions: string;
  mainscreen_instructions: string;
  case_study_details: string;
}

export interface CaseStudyUserSet {
  benjiuser_id: number;
  usergroupuser: number;
  role: CaseStudyRoles;
  is_done: boolean;
  casestudyanswer_set: any;
}

export type CaseStudyRoles = 'Note Taker' | 'Participant';

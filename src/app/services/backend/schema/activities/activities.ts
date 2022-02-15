import { GroupingToolGroups, Participant } from '../course_details';
import { User } from '../user';
import {
  BuildAPitchBlank,
  BuildAPitchEntry,
  BuildAPitchPitch,
  FeedbackQuestion,
  MCQQuestion,
  Timer,
  TitleComponent,
} from '../utils';

export interface BaseActivity {
  next_activity: number;
  activity_id: string;
  description: string;
  start_time: string;
  end_time: string;
  next_activity_delay_seconds: number;
  next_activity_start_timer: Timer;
  is_paused: boolean;
}

export interface ParentActivity {
  activity_id: string;
  activity_type: string;
  auto_next: boolean;
  description: string;
  end_time: any;
  facilitation_status: 'not-started' | 'running' | 'ended';
  id: number;
  is_paused: boolean;
  next_activity: any;
  next_activity_delay_seconds: number;
  next_activity_start_timer: Timer;
  polymorphic_ctype: number;
  run_number: number;
  start_time: string;
}

export interface LobbyActivity {
  lobby_text: string;
}

export interface TitleActivity extends ParentActivity {
  title_emoji: string;
  main_title: string;
  title_text: string;
  title_image: string;
  hide_timer: boolean;
  layout: string;
}
export interface ImageActivity extends ParentActivity {
  image: string;
  hide_timer: boolean;
  image_url: { id: number; img: string };
}

export interface MCQActivity extends ParentActivity {
  question: MCQQuestion;
  question_seconds: number;
  question_timer: Timer;
  answered_participants: Array<ParticipantCode>;
  choice_answers: Array<{ choice_id: number; selections: number }>;
  all_participant_answered: boolean;
  titlecomponent: TitleComponent;
  quiz_leaderboard: Array<LeaderBoard>;
  participant_ranks: Array<ParticipantRanks>;
  multiple_correct_answer: boolean;
}
export interface ParticipantRanks {
  participant_code: number;
  rank: number;
}
export interface LeaderBoard {
  participant_code: number;
  score: number;
}

export interface MCQResultsActivity {
  choices_summary: Array<{ id: number; answer_count: number }>;
  poll_mode: boolean;
  question_list: MCQQuestion[];
  results_summary: Array<LeaderBoard>;
  total: number;
}

// export interface UserScore {
//   id: number;
//   score: number;
// }

export interface VideoActivity {
  video_url: string;
}
export interface GoogleSlidesActivity {
  slide_url: string;
  slide_name: string;
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

// export interface TriadRoleplayPairUser {
//   user: User;
//   found: boolean;
//   id: number;
// }

export interface RoleplayPair {
  primary_roleplayuser_set: RoleplayPairUser[];
  secondary_roleplayuser_set: RoleplayPairUser[];
  group_found: boolean;
}

export interface GroupingActivity {
  grouping_complete: boolean;
  grouping_countdown_timer: Timer;
  group_set: Array<Group>;
}

export type PairGroupingActivity = GroupingActivity;
export type ExternalGroupingActivity = GroupingActivity;
export type TriadGroupingActivity = GroupingActivity;

// export interface PairGroupingActivity {
//   grouping_complete: boolean;
//   grouping_countdown_timer: Timer;
//   group_set: Array<Group>;
// }

// export interface ExternalGroupingActivity {
//   grouping_complete: boolean;
//   grouping_countdown_timer: Timer;
//   usergroup_set: Array<Group>;
// }

// export interface TriadGroupingActivity {
//   grouping_complete: boolean;
//   grouping_countdown_timer: Timer;
//   group_set: Array<Group>;
// }

// export interface UserGroupSet {
//   id: number;
//   group_num: number;
//   usergroupuser_set: Array<{ id: number; user: User; found: boolean }>;
// }

// export interface UserGroupUserSet {
//   usergroupuser_set: RoleplayPairUser[];
// }

// export interface TriadUserGroupUserSet {
//   usergroupuser_set: TriadRoleplayPairUser[];
// }

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
  submitted_participants: Array<ParticipantCode>;
  voted_participants: Array<ParticipantCode>;
}

export interface DiscussionGroupMember {
  has_volunteered: boolean;
  participant: ParticipantCode;
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
  title_emoji: string;
  feedbackquestion_set: FeedbackQuestion[];
  answered_participants: Array<ParticipantCode>;
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

export interface WhereDoYouStandAnswer {
  participant: ParticipantCode;
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
  predictions: Array<WhereDoYouStandAnswer>;
  preferences: Array<WhereDoYouStandAnswer>;
  choice_stats: WhereDoYouStandChoiceStats[];
}

export interface BrainstormActivity extends ParentActivity {
  boards: Array<Board>;
  participants: BoardParticipants;
  meeting_mode: boolean;
  host_board: number;
}

export interface Board {
  board_activity: BoardInfo;
  id: number;
  name: string;
  order: number;
  removed: boolean;
  status: string;
  sort: 'newest_to_oldest' | 'oldest_to_newest';
  brainstormcategory_set: Array<Category>;
}

export interface BoardParticipants {
  [boardID: string]: Array<number>;
}

export interface BoardInfo {
  instructions: string;
  sub_instructions: string;
  max_participant_submissions: number;
  max_participant_votes: number;
  mode: BoardMode;
  show_participant_name_flag: boolean;
  submission_complete: boolean;
  submission_countdown_timer: Timer;
  submission_seconds: number;
  participant_submission_counts: Array<{ participant_code: number; count: number }>;
  participant_vote_counts: Array<{ participant_code: number; count: number }>;
  voting_complete: boolean;
  voting_countdown_timer: Timer;
  voting_seconds: number;
  submitted_participants: Array<{ participant_code: number }>;
  all_participants_submitted: boolean;
  all_participants_voted: boolean;
  hide_timer: boolean;
  voted_participants: Array<any>;
  grouping: GroupingToolGroups;
}

export type BoardMode = 'columns' | 'thread' | 'grid';

export interface Category {
  status: string;
  id: number;
  brainstormidea_set: Array<Idea>;
  category_name: string;
  removed: boolean;
}

export interface Idea {
  id: number;
  num_votes: number;
  idea: string;
  title: string;
  removed: boolean;
  submitting_participant: ParticipantCode;
  idea_image: Image;
  showClose?: boolean;
  editing?: boolean;
  addingIdea?: boolean;
  comments: Array<{ id: number; participant: number; comment: string }>;
  hearts: Array<{ id: number; participant: number }>;
  version: number;
  time: string;
  idea_document: IdeaDocument;
  idea_video: IdeaDocument;
}
export interface IdeaDocument {
  id: number;
  document: string;
  document_type: 'video' | 'document';
}

export interface ParticipantCode {
  participant_code: number;
  display_name: string;
}

export interface Image {
  img: string;
  id: number;
}

export interface BuildAPitchActivity {
  build_countdown_timer: Timer;
  buildapitchblank_set: Array<BuildAPitchBlank>;
  buildapitchpitch_set: Array<BuildAPitchPitch>;
  building_done: boolean;
  instructions: string;
  share_start_participant: ParticipantCode;
  sharing_done: boolean;
  vote_countdown_timer: Timer;
  votes: Array<{ id: number; num_votes: number }>;
  voting_done: boolean;
  winning_participant: ParticipantCode;
  title: string;
  blanks_string: string;
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

  prepare_seconds: number;
  discuss_seconds: number;
  feedback_seconds: number;
  group_seconds: number;
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
  participant: ParticipantCode;
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
  genericroleplayparticipant_set: Array<RoleplayUser>;
  groups: Array<Group>;
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
  participant: ParticipantCode;
  role: number;
  discussion_complete: boolean;
  feedback_submitted: boolean;
}

export interface Group {
  group_num?: number;
  participantgroupstatus_set?: Array<ParticipantGroupStatus>;
  answer?: any;

  description?: string;
  id?: number;
  participants?: Array<number>;
  title?: string;
  default_worksheet_applied?: boolean;
}

export interface ParticipantGroupStatus {
  id: number;
  ready: boolean;
  participant: ParticipantCode;
}

export interface CaseStudyActivity extends ParentActivity {
  title_emoji: string;
  activity_title: string;
  activity_seconds: number;
  activity_countdown_timer: Timer;
  grouping: GroupingToolGroups;
  groups: Array<Group>;
  casestudyparticipant_set: Array<CaseStudyParticipantSet>;
  casestudyquestion_set: Array<{
    id: number;
    question_text: string;
    default_editor_content: any;
    order?: number;
  }>;
  default_data: string;
  note_taker_instructions: string;
  participant_instructions: string;
  mainscreen_instructions: string;
  case_study_details: string;
  hide_timer: boolean;
}

export interface CaseStudyParticipantSet {
  participant: ParticipantCode;
  participantgroupstatus: ParticipantGroupStatus;
  role: CaseStudyRole;
  is_done: boolean;
  casestudyanswer_set: any;
}

export type CaseStudyRole = 'Note Taker' | 'Participant';

export interface MontyHallActivity extends ParentActivity {
  change_choice_seconds: number;
  change_choice_timer: Timer;
  current_round: number;
  current_round_details: Array<CurrentRoundDetails>;
  description: string;
  initial_choice_seconds: number;
  initial_choice_timer: Timer;
  results: Array<MontyHallResult>;
  results_seconds: number;
  results_timer: Timer;
  reveal_timer: Timer;
  status: 'not_started' | 'initial_choice' | 'change_choice' | 'reveal' | 'results';
}
export interface CurrentRoundDetails {
  changed_choice: any;
  correct_door: number;
  door_choice: any;
  door_reveal: any;
  id: number;
  round_number: number;
  participant: ParticipantCode;
}

export interface MontyHallResult {
  round_number: number;
  winners_who_changed_choice: number;
  winners_who_didnt_change: number;
  losers_who_changed_choice: number;
  losers_who_didnt_change: number;
}

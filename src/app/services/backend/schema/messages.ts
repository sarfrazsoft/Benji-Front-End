import {
  BaseActivity,
  BrainstormActivity,
  BuildAPitchActivity,
  CaseStudyActivity,
  DiscussionActivity,
  ExternalGroupingActivity,
  FeedbackActivity,
  GenericRoleplayActivity,
  HintWordActivity,
  LobbyActivity,
  MCQActivity,
  MCQResultsActivity,
  MontyHallActivity,
  PairGroupingActivity,
  PitchoMaticActivity,
  RoleplayPairActivity,
  TeleTriviaActivity,
  TitleActivity,
  TriadGroupingActivity,
  VideoActivity,
  WhereDoYouStandActivity,
  WhereDoYouStandChoice,
} from './activities';
import { Lesson, LessonRun } from './course_details';
import { User } from './user';
import {
  BuildAPitchBlank,
  FeedbackQuestion,
  MCQChoice,
  MCQQuestion,
} from './utils';

export interface UpdateMessage {
  lesson: Lesson; // TODO: This is a hack and must go. Use the proper REST view (course_details/lesson/) to get this.
  lesson_run: LessonRun;
  base_activity: BaseActivity;
  brainstormactivity: BrainstormActivity;
  buildapitchactivity: BuildAPitchActivity;
  casestudyactivity: CaseStudyActivity;
  externalgroupingactivity?: ExternalGroupingActivity;
  pitchomaticactivity: PitchoMaticActivity;
  activity_type: string;
  lobbyactivity?: LobbyActivity;
  titleactivity?: TitleActivity;
  mcqactivity?: MCQActivity;
  mcqresultsactivity?: MCQResultsActivity;
  montyhallactivity?: MontyHallActivity;
  videoactivity?: VideoActivity;
  teletriviaactivity?: TeleTriviaActivity;
  roleplaypairactivity?: RoleplayPairActivity;
  genericroleplayactivity?: GenericRoleplayActivity;
  pairgroupingactivity?: PairGroupingActivity;
  hintwordactivity?: HintWordActivity;
  discussionactivity?: DiscussionActivity;
  feedbackactivity?: FeedbackActivity;
  wheredoyoustandactivity?: WhereDoYouStandActivity;
  triadgroupingactivity?: TriadGroupingActivity;
  your_identity?: User; // TODO: This is a hack and must go. Use the proper REST view (tenants/users/who_am_i) to get this.
}

export interface ClientError {
  error_type: string;
  severity: string;
  error_detail: any;
}

export interface ServerError {
  error_type: string;
  severity: string;
  error_detail: any;
}

export interface ServerNotification {
  notification_type: string;
  description: string;
  detail: any;
}

export interface ServerMessage {
  messagetime: number;
  updatemessage?: UpdateMessage;
  clienterror?: ClientError;
  servererror?: ServerError;
  servernotification?: ServerNotification;
}

export class ActivityEvent {
  event_name = 'Event';
  extra_args = {};
  toMessage() {
    return { event_type: this.event_name, ...this.extra_args };
  }
}

export class PauseActivityEvent extends ActivityEvent {
  event_name = 'PauseActivityEvent';
}

export class ResumeActivityEvent extends ActivityEvent {
  event_name = 'ResumeActivityEvent';
}

export class FastForwardEvent extends ActivityEvent {
  event_name = 'FastForwardEvent';
}

export class BootUserEvent extends ActivityEvent {
  event_name = 'BootUserEvent';
  constructor(user_id) {
    super();
    this.extra_args = { user_id: user_id };
  }
}

export class LobbyStartButtonClickEvent extends ActivityEvent {
  event_name = 'LobbyStartButtonClickEvent';
}

export class EndEvent extends ActivityEvent {
  event_name = 'EndEvent';
}

export class NextInternalEvent extends ActivityEvent {
  event_name = 'NextInternalEvent';
}

export class TeleTriviaUserInCircleEvent extends ActivityEvent {
  event_name = 'TeleTriviaUserInCircleEvent';
}

export class TeleTriviaStartGameEvent extends ActivityEvent {
  event_name = 'TeleTriviaStartGameEvent';
}

export class TeleTriviaSubmitAnswerEvent extends ActivityEvent {
  event_name = 'TeleTriviaSubmitAnswerEvent';

  constructor(question: MCQQuestion, answer: MCQChoice) {
    super();
    this.extra_args = { question: question.id, answer: answer.id };
  }
}

export class TeleTriviaMessageReturnedEvent extends ActivityEvent {
  event_name = 'TeleTriviaMessageReturnedEvent';
}

export class TeleTriviaSharingDoneEvent extends ActivityEvent {
  event_name = 'TeleTriviaSharingDoneEvent';
}

export class GroupingUserFoundEvent extends ActivityEvent {
  event_name = 'GroupingUserFoundEvent';
}

export class RoleplayPairUserFoundEvent extends ActivityEvent {
  event_name = 'RoleplayPairUserFoundEvent';
}

export class RoleplayPairUserDiscussedEvent extends ActivityEvent {
  event_name = 'RoleplayPairUserDiscussedEvent';
}

export class HintWordSubmitWordEvent extends ActivityEvent {
  event_name = 'HintWordSubmitWordEvent';

  constructor(word: string) {
    super();
    this.extra_args = { word: word };
  }
}

export class HintWordSubmitVoteEvent extends ActivityEvent {
  event_name = 'HintWordSubmitVoteEvent';

  constructor(word_id: number) {
    super();
    this.extra_args = { hintwordword: word_id };
  }
}

export class MCQSubmitAnswerEvent extends ActivityEvent {
  event_name = 'MCQSubmitAnswerEvent';

  constructor(answer: MCQChoice) {
    super();
    this.extra_args = { answer: answer.id };
  }
}

export class DiscussionSharingVolunteerEvent extends ActivityEvent {
  event_name = 'DiscussionSharingVolunteerEvent';
}

export class DiscussionSharerDoneEvent extends ActivityEvent {
  event_name = 'DiscussionSharerDoneEvent';
}

export class WhereDoYouStandSubmitPredictionEvent extends ActivityEvent {
  event_name = 'WhereDoYouStandSubmitPredictionEvent';

  constructor(choice: WhereDoYouStandChoice) {
    super();
    this.extra_args = { choice: choice.id };
  }
}

export class WhereDoYouStandSubmitPreferenceEvent extends ActivityEvent {
  event_name = 'WhereDoYouStandSubmitPreferenceEvent';

  constructor(choice: WhereDoYouStandChoice) {
    super();
    this.extra_args = { choice: choice.id };
  }
}

export class FeedbackSubmitEventAnswer {
  feedbackquestion: number;
  rating_answer: number;
  text_answer: string;

  constructor(q: FeedbackQuestion, rating, text) {
    this.feedbackquestion = q.id;
    this.rating_answer = rating;
    this.text_answer = text;
  }
}

export class FeedbackSubmitEvent extends ActivityEvent {
  event_name = 'FeedbackSubmitEvent';

  constructor(feedbacksubmiteventanswer_set: FeedbackSubmitEventAnswer[]) {
    super();
    this.extra_args = {
      feedbacksubmiteventanswer_set: feedbacksubmiteventanswer_set,
    };
  }
}

export class BuildAPitchSubmitEventEntry {
  buildapitchblank: number;
  value: string;

  constructor(entry: BuildAPitchBlank, value: string) {
    this.buildapitchblank = entry.id;
    this.value = value;
  }
}

export class BuildAPitchSubmitPitchEvent extends ActivityEvent {
  event_name = 'BuildAPitchSubmitPitchEvent';

  constructor(
    buildapitchsubmissionentry_set: Array<BuildAPitchSubmitEventEntry>
  ) {
    super();
    this.extra_args = {
      buildapitchsubmissionentry_set: buildapitchsubmissionentry_set,
    };
  }
}

export class BuildAPitchSharingDoneEvent extends ActivityEvent {
  event_name = 'BuildAPitchSharingDoneEvent';
}

export class BuildAPitchSubmitVoteEvent extends ActivityEvent {
  event_name = 'BuildAPitchSubmitVoteEvent';

  constructor(choice: number) {
    super();
    this.extra_args = { voted_user: choice };
  }
}

export class PitchoMaticUserGeneratedEvent extends ActivityEvent {
  event_name = 'PitchoMaticUserGeneratedEvent';
}

export class PitchoMaticUserInGroupEvent extends ActivityEvent {
  event_name = 'PitchoMaticUserInGroupEvent';
}

export class PitchoMaticUserReadyEvent extends ActivityEvent {
  event_name = 'PitchoMaticUserReadyEvent';

  constructor(pitch_prep_text?: string) {
    super();
    this.extra_args = { pitch_prep_text: pitch_prep_text };
  }
}

export class PitchoMaticSubmitFeedbackEvent extends ActivityEvent {
  event_name = 'PitchoMaticSubmitFeedbackEvent';

  constructor(pitchfeedbacksubmiteventanswer_set: FeedbackSubmitEventAnswer[]) {
    super();
    this.extra_args = {
      pitchfeedbacksubmiteventanswer_set: pitchfeedbacksubmiteventanswer_set,
    };
  }
}

export class BrainstormToggleCategoryModeEvent extends ActivityEvent {
  event_name = 'BrainstormToggleCategoryModeEvent';
}

export class BrainstormSubmitEvent extends ActivityEvent {
  event_name = 'BrainstormSubmitEvent';

  constructor(text: string) {
    super();
    this.extra_args = { idea: text };
  }
}

export class BrainstormRemoveSubmissionEvent extends ActivityEvent {
  event_name = 'BrainstormRemoveSubmissionEvent';

  constructor(id: number) {
    super();
    this.extra_args = { brainstormidea: id };
  }
}

export class BrainstormVoteEvent extends ActivityEvent {
  event_name = 'BrainstormVoteEvent';

  constructor(id: number) {
    super();
    this.extra_args = { brainstormidea: id };
  }
}

export class BrainstormSetCategoryEvent extends ActivityEvent {
  event_name = 'BrainstormSetCategoryEvent';

  constructor(id: number, category: string) {
    super();
    this.extra_args = { brainstormidea: id, category: category };
  }
}

export class ExternalGroupingSubmitGroupEvent extends ActivityEvent {
  event_name = 'ExternalGroupingSubmitGroupEvent';

  constructor(group_num: number, userId?: number) {
    super();
    this.extra_args = { benjiuser_id: userId, group_num: group_num };
  }
}

export class GenericRoleplayUserDiscussedEvent extends ActivityEvent {
  event_name = 'GenericRoleplayUserDiscussedEvent';
  constructor() {
    super();
  }
}

export class GenericRoleplayUserFeedbackEvent extends ActivityEvent {
  event_name = 'GenericRoleplayUserFeedbackEvent';
  constructor(
    genericroleplayuserfeedbackeventanswer_set: FeedbackSubmitEventAnswer[]
  ) {
    super();
    this.extra_args = {
      genericroleplayuserfeedbackeventanswer_set: genericroleplayuserfeedbackeventanswer_set,
    };
  }
}

export class CaseStudySaveFormEvent extends ActivityEvent {
  event_name = 'CaseStudySaveFormEvent';
  constructor(caseStudySubmitEventAnswer_set: CaseStudySubmitEventAnswer[]) {
    super();
    this.extra_args = {
      casestudyeventanswer_set: caseStudySubmitEventAnswer_set,
    };
  }
}

export class CaseStudySubmitEventAnswer {
  casestudyquestion: number;
  answer: string;

  constructor(qId, text) {
    this.casestudyquestion = qId;
    this.answer = text;
  }
}

export class CaseStudyTeamDoneEvent extends ActivityEvent {
  event_name = 'CaseStudyTeamDoneEvent';
  constructor() {
    super();
  }
}

export class GatherActivityContinueEvent extends ActivityEvent {
  event_name = 'GatherActivityContinueEvent';
  constructor() {
    super();
  }
}

export class MontyHallSelectDoorEvent extends ActivityEvent {
  event_name = 'MontyHallSelectDoorEvent';

  constructor(door_choice: number) {
    super();
    this.extra_args = { door_choice: door_choice };
  }
}

export class MontyHallRepeatEvent extends ActivityEvent {
  event_name = 'MontyHallRepeatEvent';
  constructor() {
    super();
  }
}

export class LobbySetNicknameEvent extends ActivityEvent {
  nickname: string;
  user_id: number;

  constructor(nickname, user_id?) {
    super();
    this.extra_args = { nickname: nickname, user_id: user_id };
  }
}

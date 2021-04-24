import { ConvoCardsActivity } from './activities';
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
  ImageActivity,
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
import { Lesson, LessonRun, RunningTools } from './course_details';
import { User } from './user';
import { BuildAPitchBlank, FeedbackQuestion, MCQChoice, MCQQuestion } from './utils';

export interface UpdateMessage {
  // TODO: This is a hack and must go. Use the proper REST view (course_details/lesson/) to get this.
  lesson: Lesson;
  lesson_run: LessonRun;
  running_tools: RunningTools;
  brainstormactivity?: BrainstormActivity;
  imageactivity?: ImageActivity;
  buildapitchactivity?: BuildAPitchActivity;
  casestudyactivity?: CaseStudyActivity;
  convoactivity?: ConvoCardsActivity;
  externalgroupingactivity?: ExternalGroupingActivity;
  pitchomaticactivity?: PitchoMaticActivity;
  // activity type should be specifi rather than a string
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

// export class Ddatemessage implements UpdateMessage {
//   updateMessage;
//   activity_type;
//   base_activity;
//   lesson_run;
//   lesson;

//   getActivity() {
//     return this.updateMessage[this.activity_type.toLowerCase]
//   }
// }

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

export class ResetEvent extends ActivityEvent {
  event_name = 'ResetEvent';
}

export class PreviousEvent extends ActivityEvent {
  event_name = 'PreviousEvent';
}

export class BootParticipantEvent extends ActivityEvent {
  event_name = 'BootParticipantEvent';
  constructor(participant_code) {
    super();
    this.extra_args = { participant_code };
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

export class GroupingParticipantReadyEvent extends ActivityEvent {
  event_name = 'GroupingParticipantReadyEvent';
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

  constructor(buildapitchsubmissionentry_set: Array<BuildAPitchSubmitEventEntry>) {
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
    this.extra_args = { voted_participant: choice };
  }
}

export class PitchoMaticParticipantGeneratedEvent extends ActivityEvent {
  event_name = 'PitchoMaticParticipantGeneratedEvent';
}

export class PitchoMaticParticipantInGroupEvent extends ActivityEvent {
  event_name = 'PitchoMaticParticipantInGroupEvent';
}

export class PitchoMaticParticipantReadyEvent extends ActivityEvent {
  event_name = 'PitchoMaticParticipantReadyEvent';

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

export class BeginShareEvent extends ActivityEvent {
  event_name = 'BeginShareEvent';
}
export class EndShareEvent extends ActivityEvent {
  event_name = 'EndShareEvent';
}

export class ParticipantOptInEvent extends ActivityEvent {
  event_name = 'ParticipantOptInEvent';
}

export class ParticipantOptOutEvent extends ActivityEvent {
  event_name = 'ParticipantOptOutEvent';
}

export class SelectParticipantForShareEvent extends ActivityEvent {
  event_name = 'SelectParticipantForShareEvent';
  constructor(userId: number) {
    super();
    this.extra_args = { participant_code: userId };
  }
}

export class ParticipantSelectCardEvent extends ActivityEvent {
  event_name = 'ParticipantSelectCardEvent';
  constructor(cardNumber: number) {
    super();
    this.extra_args = { card_number: cardNumber };
  }
}

export class BrainstormSubmissionCompleteInternalEvent extends ActivityEvent {
  event_name = 'BrainstormSubmissionCompleteInternalEvent';
}

export class BrainstormVotingCompleteInternalEvent extends ActivityEvent {
  event_name = 'BrainstormVotingCompleteInternalEvent';
}

export class BrainstormSubmitEvent extends ActivityEvent {
  event_name = 'BrainstormSubmitEvent';

  constructor(text: string, category: number, idea_image?: number) {
    super();
    if (idea_image) {
      this.extra_args = {
        idea: text,
        category: category,
        idea_image: idea_image,
      };
    } else {
      this.extra_args = { idea: text, category: category };
    }
  }
}

export class BrainstormRemoveSubmissionEvent extends ActivityEvent {
  event_name = 'BrainstormRemoveSubmissionEvent';

  constructor(id: number) {
    super();
    this.extra_args = { brainstormidea: id };
  }
}

export class BrainstormRenameCategoryEvent extends ActivityEvent {
  event_name = 'BrainstormRenameCategoryEvent';

  constructor(category: number, name: string) {
    super();
    this.extra_args = { category: category, category_name: name };
  }
}

export class BrainstormCreateCategoryEvent extends ActivityEvent {
  event_name = 'BrainstormCreateCategoryEvent';

  constructor(category: string) {
    super();
    this.extra_args = { category_name: category };
  }
}

export class BrainstormRemoveCategoryEvent extends ActivityEvent {
  event_name = 'BrainstormRemoveCategoryEvent';

  constructor(catId: number, deleteIdeas: boolean) {
    super();
    this.extra_args = { category: catId, delete_ideas: deleteIdeas };
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
    this.extra_args = { participant_code: userId, group_num: group_num };
  }
}

export class GenericRoleplayParticipantDiscussedEvent extends ActivityEvent {
  event_name = 'GenericRoleplayParticipantDiscussedEvent';
  constructor() {
    super();
  }
}

export class GenericRoleplayParticipantFeedbackEvent extends ActivityEvent {
  event_name = 'GenericRoleplayParticipantFeedbackEvent';
  constructor(genericroleplayparticipantfeedbackanswer_set: FeedbackSubmitEventAnswer[]) {
    super();
    this.extra_args = {
      genericroleplayparticipantfeedbackanswer_set: genericroleplayparticipantfeedbackanswer_set,
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
export class JumpEvent extends ActivityEvent {
  event_name = 'JumpEvent';
  nav_activity: string;

  constructor(nav_activity) {
    super();
    this.extra_args = { nav_activity: nav_activity };
  }
}

//
//
//
//
export class CreateGroupingEvent extends ActivityEvent {
  event_name = 'CreateGroupingEvent';
  constructor(title: string) {
    super();
    this.extra_args = { title: title };
  }
}

export class EditGroupTitleEvent extends ActivityEvent {
  event_name = 'EditGroupTitleEvent';
  constructor(group: number, title: string) {
    super();
    this.extra_args = { group: group, title: title };
  }
}

export class EditGroupingTitleEvent extends ActivityEvent {
  event_name = 'EditGroupingTitleEvent';
  constructor(grouping: number, title: string) {
    super();
    this.extra_args = { grouping: grouping, title: title };
  }
}

export class SelectGroupingEvent extends ActivityEvent {
  event_name = 'SelectGroupingEvent';
  constructor(grouping: number) {
    super();
    this.extra_args = { grouping: grouping };
  }
}

export class AllowParticipantGroupingEvent extends ActivityEvent {
  event_name = 'AllowParticipantGroupingEvent';
  constructor(permission: boolean) {
    super();
    this.extra_args = { allow: permission };
  }
}

export class ViewGroupingEvent extends ActivityEvent {
  event_name = 'ViewGroupingEvent';
  constructor(permission: boolean) {
    super();
    this.extra_args = { view: permission };
  }
}

export class AllowParticipantGroupingMidActivityEvent extends ActivityEvent {
  event_name = 'AllowParticipantGroupingMidActivityEvent';
  constructor(permission: boolean) {
    super();
    this.extra_args = { allow: permission };
  }
}

export class CreateGroupEvent extends ActivityEvent {
  event_name = 'CreateGroupEvent';
  constructor(grouping: number, title: string) {
    super();
    this.extra_args = { grouping: grouping, title: title };
  }
}

export class DeleteGroupingGroupEvent extends ActivityEvent {
  event_name = 'DeleteGroupingGroupEvent';
  constructor(group: number) {
    super();
    this.extra_args = { group: group };
  }
}

export class GroupingAssignParticipantEvent extends ActivityEvent {
  event_name = 'GroupingAssignParticipantEvent';
  constructor(group: number, participant_code: number) {
    super();
    this.extra_args = { group: group, participant_code: participant_code };
  }
}

export class GroupingParticipantSelfJoinEvent extends ActivityEvent {
  event_name = 'GroupingParticipantSelfJoinEvent';
  constructor(group: number) {
    super();
    this.extra_args = { group: group };
  }
}

export class StartCaseStudyGroupEvent extends ActivityEvent {
  event_name = 'StartCaseStudyGroupEvent';
}

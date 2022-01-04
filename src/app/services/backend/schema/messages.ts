import { ConvoCardsActivity, GoogleSlidesActivity } from './activities';
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
  eventType: string;
  brainstormactivity?: BrainstormActivity;
  imageactivity?: ImageActivity;
  buildapitchactivity?: BuildAPitchActivity;
  googleslidesactivity?: GoogleSlidesActivity;
  casestudyactivity?: CaseStudyActivity;
  convoactivity?: ConvoCardsActivity;
  externalgroupingactivity?: ExternalGroupingActivity;
  pitchomaticactivity?: PitchoMaticActivity;
  // activity type should be specifi rather than a string
  activity_type: string;
  lobbyactivity?: LobbyActivity;
  titleactivity?: TitleActivity;
  mcqactivity?: MCQActivity;
  pollactivity?: MCQActivity;
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
  eventtype: string;
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

  constructor(answers: Array<MCQChoice>) {
    super();
    this.extra_args = { answers: answers };
  }
}
export class PollSubmitAnswerEvent extends ActivityEvent {
  event_name = 'PollSubmitAnswerEvent';

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
  mcq_answer: number;
  scale_answer: number;

  constructor(q: FeedbackQuestion, answer, text?) {
    this.feedbackquestion = q.id;
    this.rating_answer = answer;
    this.text_answer = text ? text : null;
    this.mcq_answer = answer;
    this.scale_answer = answer;
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
  order: number;
  value: string;

  constructor(value: string, order: number) {
    this.value = value;
    this.order = order;
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
export class BrainstormToggleParticipantNameEvent extends ActivityEvent {
  event_name = 'BrainstormToggleParticipantNameEvent';
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

export class SubmitSharingParticipantCommentEvent extends ActivityEvent {
  event_name = 'SubmitSharingParticipantCommentEvent';
  constructor(comment: string) {
    super();
    this.extra_args = { text: comment };
  }
}

export class SubmitSharingParticipantReactionEvent extends ActivityEvent {
  event_name = 'SubmitSharingParticipantReactionEvent';
  constructor(reaction: string) {
    super();
    this.extra_args = { reaction: reaction };
  }
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

  constructor(
    text: string,
    title: string,
    category: number,
    groupId: number,
    idea_image?: number,
    image_path?: string
  ) {
    super();
    this.extra_args = { idea: text, title: title, category: category, group_id: groupId };
    if (idea_image) {
      this.extra_args = {
        ...this.extra_args,
        idea_image: idea_image,
        image_path: image_path,
      };
    }
  }
}
export class BrainstormSubmitDocumentEvent extends ActivityEvent {
  event_name = 'BrainstormSubmitEvent';

  constructor(text: string, title: string, category: number, groupId: number, documentId: number) {
    super();
    this.extra_args = {
      idea: text,
      title: title,
      category: category,
      group_id: groupId,
      idea_document: documentId,
    };
  }
}
export class BrainstormEditIdeaSubmitEvent extends ActivityEvent {
  event_name = 'BrainstormEditIdeaSubmitEvent';

  constructor(
    id: number,
    text: string,
    title: string,
    category: number,
    groupId: number,
    idea_image?: number,
    image_path?: string
  ) {
    super();
    this.extra_args = { brainstormidea: id, idea: text, title: title, category: category, group_id: groupId };

    if (idea_image) {
      this.extra_args = {
        ...this.extra_args,
        idea_image: idea_image,
        image_path: image_path,
      };
    }
  }
}

export class BrainstormImageSubmitEvent extends ActivityEvent {
  event_name = 'BrainstormSubmitEvent';

  constructor(text: string, title: string, category: number, groupId: number, image_path?: string) {
    super();
    this.extra_args = {
      idea: text,
      title: title,
      category: category,
      group_id: groupId,
      image_path: image_path,
    };
  }
}

export class BrainstormSubmitIdeaCommentEvent extends ActivityEvent {
  event_name = 'BrainstormSubmitIdeaCommentEvent';

  constructor(text: string, ideaId: number) {
    super();
    this.extra_args = {
      comment: text,
      brainstormidea: ideaId,
    };
  }
}

export class BrainstormRemoveIdeaCommentEvent extends ActivityEvent {
  event_name = 'BrainstormRemoveIdeaCommentEvent';

  constructor(commentId: number, ideaId: number) {
    super();
    this.extra_args = {
      comment_id: commentId,
      brainstormidea: ideaId,
    };
  }
}

export class BrainstormSubmitIdeaHeartEvent extends ActivityEvent {
  event_name = 'BrainstormSubmitIdeaHeartEvent';

  constructor(ideaId: number) {
    super();
    this.extra_args = {
      brainstormidea: ideaId,
      heart: true,
    };
  }
}
export class BrainstormRemoveIdeaHeartEvent extends ActivityEvent {
  event_name = 'BrainstormRemoveIdeaHeartEvent';

  constructor(ideaId: number, comment_id: number) {
    super();
    this.extra_args = {
      brainstormidea: ideaId,
      comment_id: comment_id,
    };
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

// export class CaseStudySaveFormEvent extends ActivityEvent {
//   event_name = 'CaseStudySaveFormEvent';
//   constructor(caseStudySubmitEventAnswer_set: CaseStudySubmitEventAnswer[]) {
//     super();
//     this.extra_args = {
//       casestudyeventanswer_set: caseStudySubmitEventAnswer_set,
//     };
//   }
// }

export class CaseStudySubmitAnswerEvent extends ActivityEvent {
  event_name = 'CaseStudySubmitAnswerEvent';

  constructor(json, texts) {
    super();
    this.extra_args = { answer: json, answer_text: texts };
  }
}
export class CaseStudyDefaultWorksheetApplied extends ActivityEvent {
  event_name = 'CaseStudyDefaultWorksheetApplied';

  constructor(val: boolean) {
    super();
    this.extra_args = { default_worksheet_applied: { val: val } };
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
export class CreateGroupsEvent extends ActivityEvent {
  event_name = 'CreateGroupsEvent';
  constructor(grouping: number, groups: number) {
    super();
    this.extra_args = { grouping: grouping, groups: groups };
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
export class UpdateGroupingStyleEvent extends ActivityEvent {
  event_name = 'UpdateGroupingStyleEvent';
  constructor(grouping: number, permission: string) {
    super();
    this.extra_args = { grouping: grouping, style: permission };
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
export class DeleteGroupingEvent extends ActivityEvent {
  event_name = 'DeleteGroupingEvent';
  constructor(grouping: number) {
    super();
    this.extra_args = { grouping: grouping };
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
  constructor(grouping: number, group: number, participant_code: number) {
    super();
    this.extra_args = { grouping: grouping, group: group, participant_code: participant_code };
  }
}
export class RemoveParticipantFromGroupEvent extends ActivityEvent {
  event_name = 'RemoveParticipantFromGroupEvent';
  constructor(grouping: number, group: number, participant_code: number) {
    super();
    this.extra_args = { grouping: grouping, group: group, participant_code: participant_code };
  }
}

export class GroupingParticipantSelfJoinEvent extends ActivityEvent {
  event_name = 'GroupingParticipantSelfJoinEvent';
  constructor(grouping: number, group: number) {
    super();
    this.extra_args = { grouping: grouping, group: group };
  }
}

export class StartCaseStudyGroupEvent extends ActivityEvent {
  event_name = 'StartCaseStudyGroupEvent';
  constructor(id: number) {
    super();
    this.extra_args = { grouping: id };
  }
}

export class StartBrainstormGroupEvent extends ActivityEvent {
  event_name = 'StartBrainstormGroupEvent';
  constructor(id: number) {
    super();
    this.extra_args = { grouping: id };
  }
}
export class AssignGroupingToActivities extends ActivityEvent {
  event_name = 'AssignGroupingToActivities';
  constructor(id: number, activityIDs: Array<number>) {
    super();
    this.extra_args = { grouping: id, activity_ids: activityIDs };
  }
}
export class ResetGroupingEvent extends ActivityEvent {
  event_name = 'ResetGroupingEvent';
  constructor(id: number) {
    super();
    this.extra_args = { grouping: id };
  }
}

export class CardsShuffleEvent extends ActivityEvent {
  event_name = 'CardsShuffleEvent';
  constructor(deal_number: number) {
    super();
    this.extra_args = { deal_number: deal_number };
  }
}
export class CardsStartSharingStageEvent extends ActivityEvent {
  event_name = 'CardsStartSharingStageEvent';
}
export class CardsStartSetupStageEvent extends ActivityEvent {
  event_name = 'CardsStartSetupStageEvent';
}
export class CardsSetSharingTime extends ActivityEvent {
  event_name = 'CardsSetSharingTime';
  constructor(sharing_time: number) {
    super();
    this.extra_args = { sharing_time: sharing_time };
  }
}
export class CardsSetParticipantSkipCardsPermissionEvent extends ActivityEvent {
  event_name = 'CardsSetParticipantSkipCardsPermissionEvent';
  constructor(val: boolean) {
    super();
    this.extra_args = { val: val };
  }
}
export class CardsAddParticipantToCurrentlySharingEvent extends ActivityEvent {
  event_name = 'CardsAddParticipantToCurrentlySharingEvent';
  constructor(val: number) {
    super();
    this.extra_args = { val: val };
  }
}
export class CardsParticipantReadyEvent extends ActivityEvent {
  event_name = 'CardsParticipantReadyEvent';
}
export class CardsRestartActivityEvent extends ActivityEvent {
  event_name = 'CardsRestartActivityEvent';
}
export class BrainstormEditInstructionEvent extends ActivityEvent {
  event_name = 'BrainstormEditInstructionEvent';
  constructor(title: string) {
    super();
    this.extra_args = { instructions: title };
  }
}

import {
  BaseActivity,
  DiscussionActivity,
  FeedbackActivity,
  HintWordActivity,
  LobbyActivity,
  MCQActivity,
  MCQResultsActivity,
  RoleplayPairActivity,
  TeleTriviaActivity,
  TitleActivity,
  VideoActivity,
  WhereDoYouStandActivity,
  WhereDoYouStandChoice
} from './activities';
import { Lesson, LessonRun } from './course_details';
import { User } from './user';
import {FeedbackQuestion, MCQChoice, MCQQuestion} from './utils';

export interface UpdateMessage {
  lesson: Lesson; // TODO: This is a hack and must go. Use the proper REST view (course_details/lesson/) to get this.
  lesson_run: LessonRun;
  base_activity: BaseActivity;
  activity_type: string;
  lobbyactivity?: LobbyActivity;
  titleactivity?: TitleActivity;
  mcqactivity?: MCQActivity;
  mcqresultsactivity?: MCQResultsActivity;
  videoactivity?: VideoActivity;
  teletriviaactivity?: TeleTriviaActivity;
  roleplaypairactivity?: RoleplayPairActivity;
  hintwordactivity?: HintWordActivity;
  discussionactivity?: DiscussionActivity;
  feedbackactivity?: FeedbackActivity;
  wheredoyoustandactivity?: WhereDoYouStandActivity;
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
  choice_answer: number;
  rating_answer: number;
  text_answer: string;

  constructor(q: FeedbackQuestion, answer) {
    this.feedbackquestion = q.id;
    if (q.question_type === 'choice') {
      // We expect the answer to be a FeedbackChoice object
      this.choice_answer = answer.id;
    } else if (q.question_type === 'rating') {
      this.rating_answer = answer;
    } else {
      this.text_answer = answer;
    }
  }
}

export class FeedbackSubmitEvent extends ActivityEvent {
  event_name = 'FeedbackSubmitEvent';

  constructor(feedbacksubmiteventanswer_set: FeedbackSubmitEventAnswer[]) {
    super();
    this.extra_args = { feedbacksubmiteventanswer_set: feedbacksubmiteventanswer_set };
  }
}

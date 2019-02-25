import { BaseActivity, HintWordActivity, LobbyActivity, MCQActivity, RoleplayPairActivity, TeleTriviaActivity, VideoActivity } from './activities';
import { Lesson, LessonRun } from './course_details';
import { User } from './user';
import { MCQChoice, MCQQuestion } from './utils';

export interface UpdateMessage {
  lesson: Lesson; // TODO: This is a hack and must go. Use the proper REST view (course_details/lesson/) to get this.
  lesson_run: LessonRun;
  base_activity: BaseActivity;
  activity_type: string;
  lobbyactivity?: LobbyActivity;
  mcqactivity?: MCQActivity;
  videoactivity?: VideoActivity;
  teletriviaactivity?: TeleTriviaActivity;
  roleplaypairactivity?: RoleplayPairActivity;
  hintwordactivity?: HintWordActivity;
  your_identity?: User; // TODO: This is a hack and must go. Use the proper REST view (tenants/users/who_am_i) to get this.
}

export interface ServerMessage {
  updatemessage?: UpdateMessage;
  clienterror?: any;
  servererror?: any;
}

export class ActivityEvent {
  event_name = 'Event';
  extra_args = {};
  toMessage() {
    return {'event_type': this.event_name, ...this.extra_args };
  }
}

export class LobbyStartButtonClickEvent extends ActivityEvent {
  event_name = 'LobbyStartButtonClickEvent';
}

export class EndEvent extends ActivityEvent {
  event_name = 'EndEvent';
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
    this.extra_args = {'question': question.id, 'answer': answer.id};
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
    this.extra_args = {'word': word};
  }
}

export class HintWordSubmitVoteEvent extends ActivityEvent {
  event_name = 'HintWordSubmitVoteEvent';

  constructor(word_id: number) {
    super();
    this.extra_args = {'hintwordword': word_id};
  }
}

export class MCQSubmitAnswerEvent extends ActivityEvent {
  event_name = 'MCQSubmitAnswerEvent';

  constructor(answer: MCQChoice) {
    super();
    this.extra_args = {'answer': answer.id};
  }
}

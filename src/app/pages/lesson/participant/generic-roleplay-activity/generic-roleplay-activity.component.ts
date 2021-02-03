import { Component, OnChanges, OnInit } from '@angular/core';
import { ContextService } from 'src/app/services';
import {
  FeedbackSubmitEventAnswer,
  GenericRoleplayParticipantFeedbackEvent,
  RoleplayRole,
  RoleplayUser,
  Timer,
  User,
} from 'src/app/services/backend/schema';
import { EmojiLookupService } from 'src/app/services/emoji-lookup.service';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-generic-roleplay-activity',
  templateUrl: './generic-roleplay-activity.component.html',
  styleUrls: ['./generic-roleplay-activity.component.scss'],
})
export class ParticipantGenericRoleplayActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  roleplayPhase = true;
  feedbackPhase = false;
  giveFeedback = false;
  rplayTimer: Timer;
  feedbackTimer: Timer;
  timerInterval;
  currentUser: number;
  observerSubmitted = false;

  constructor(private emoji: EmojiLookupService, private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges() {
    this.currentUser = this.getParticipantCode();

    const act = this.activityState.genericroleplayactivity;
    this.contextService.activityTimer = act.activity_countdown_timer;
    this.rplayTimer = act.activity_countdown_timer;

    if (this.rplayTimer.status !== 'ended') {
      this.giveFeedback = false;
      this.contextService.activityTimer = act.activity_countdown_timer;
    }

    this.feedbackTimer = act.feedback_countdown_timer;
    if (this.feedbackTimer && this.rplayTimer.status === 'ended') {
      this.giveFeedback = true;
      this.contextService.activityTimer = act.feedback_countdown_timer;
    }
  }

  userFeedbackSubmitted(): boolean {
    const userSet = this.activityState.genericroleplayactivity.genericroleplayparticipant_set;

    let submitted = false;
    userSet.forEach((user: RoleplayUser) => {
      if (user.participant.participant_code === this.currentUser) {
        submitted = user.feedback_submitted;
      }
    });
    return submitted;
  }

  getParticipantRole(): RoleplayRole {
    const userSet = this.activityState.genericroleplayactivity.genericroleplayparticipant_set;
    const roles = this.activityState.genericroleplayactivity.genericroleplayrole_set;

    let role: RoleplayRole;
    userSet.forEach((user: RoleplayUser) => {
      if (user.participant.participant_code === this.currentUser) {
        console.log(roles.filter((r) => r.id === user.role)[0]);
        role = roles.filter((r) => r.id === user.role)[0];
      }
    });

    // Sort based on ID
    // Should be based on sort property if available
    role.feedbackquestions.sort((a, b) => a.id - b.id);
    return role;
  }

  isObserver(): boolean {
    const participantRole: RoleplayRole = this.getParticipantRole();
    if (participantRole.name === 'Observer') {
      return true;
    } else {
      return false;
    }
  }

  submitAnswers(val): void {
    const answers: Array<FeedbackSubmitEventAnswer> = [];
    for (let i = 0; i < val.questions.length; i++) {
      if (val.questions[i].question_type === 'rating_agreedisagree') {
        const ans = new FeedbackSubmitEventAnswer(
          val.questions[i].q,
          val.questions[i].rating_answer,
          val.questions[i].text_answer
        );
        answers.push(ans);
      }
      if (val.questions[i].question_type === 'text') {
        const ans = new FeedbackSubmitEventAnswer(
          val.questions[i].q,
          val.questions[i].rating_answer,
          val.questions[i].text_answer
        );
        answers.push(ans);
      }
    }
    this.sendMessage.emit(new GenericRoleplayParticipantFeedbackEvent(answers));
    this.observerSubmitted = true;
  }
}

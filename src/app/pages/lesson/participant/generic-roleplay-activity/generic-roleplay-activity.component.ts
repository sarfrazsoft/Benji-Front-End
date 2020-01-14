import { Component, OnChanges } from '@angular/core';
import {
  FeedbackSubmitEventAnswer,
  GenericRoleplayUserFeedbackEvent,
  RoleplayRole,
  RoleplayUser,
  Timer,
  User
} from 'src/app/services/backend/schema';
import { EmojiLookupService } from 'src/app/services/emoji-lookup.service';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-generic-roleplay-activity',
  templateUrl: './generic-roleplay-activity.component.html',
  styleUrls: ['./generic-roleplay-activity.component.scss']
})
export class ParticipantGenericRoleplayActivityComponent
  extends BaseActivityComponent
  implements OnChanges {
  roleplayPhase = true;
  feedbackPhase = false;
  giveFeedback = false;
  rplayTimer: Timer;
  feedbackTimer: Timer;
  timerInterval;
  currentUser: User;
  observerSubmitted = false;

  constructor(private emoji: EmojiLookupService) {
    super();
  }

  ngOnChanges() {
    this.currentUser = this.activityState.your_identity;

    const act = this.activityState.genericroleplayactivity;
    this.rplayTimer = act.activity_countdown_timer;
    if (this.rplayTimer.status !== 'ended') {
      this.giveFeedback = false;
    }

    this.feedbackTimer = act.feedback_countdown_timer;
    if (this.feedbackTimer && this.rplayTimer.status === 'ended') {
      this.giveFeedback = true;
    }
  }

  userFeedbackSubmitted(): boolean {
    const userSet = this.activityState.genericroleplayactivity
      .genericroleplayuser_set;

    let submitted = false;
    userSet.forEach((user: RoleplayUser) => {
      if (user.benjiuser_id === this.currentUser.id) {
        submitted = user.feedback_submitted;
      }
    });
    return submitted;
  }

  getParticipantRole(): RoleplayRole {
    const userSet = this.activityState.genericroleplayactivity
      .genericroleplayuser_set;
    const roles = this.activityState.genericroleplayactivity
      .genericroleplayrole_set;

    let role: RoleplayRole;
    userSet.forEach((user: RoleplayUser) => {
      if (user.benjiuser_id === this.currentUser.id) {
        role = roles.filter(r => r.id === user.role)[0];
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
    this.sendMessage.emit(new GenericRoleplayUserFeedbackEvent(answers));
    this.observerSubmitted = true;
  }
}

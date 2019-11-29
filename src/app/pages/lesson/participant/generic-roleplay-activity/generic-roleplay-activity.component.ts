import { Component, OnChanges, OnInit } from '@angular/core';
import {
  FeedbackSubmitEvent,
  FeedbackSubmitEventAnswer,
  RoleplayRole,
  RoleplayUser,
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
  implements OnInit, OnChanges {
  constructor(private emoji: EmojiLookupService) {
    super();
  }
  currentUser: User;
  answersSubmitted = false;
  // 76878;

  ngOnInit() {}

  ngOnChanges() {
    this.currentUser = this.activityState.your_identity;
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
    return role;
  }

  isObserver() {
    const participantRole: RoleplayRole = this.getParticipantRole();
    const userSet = this.activityState.genericroleplayactivity
      .genericroleplayuser_set;
    if (participantRole.feedbackquestions.length) {
      return true;
    } else {
      return false;
    }
  }

  submitAnswers(val) {
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
    this.sendMessage.emit(new FeedbackSubmitEvent(answers));
    this.answersSubmitted = true;
  }
}

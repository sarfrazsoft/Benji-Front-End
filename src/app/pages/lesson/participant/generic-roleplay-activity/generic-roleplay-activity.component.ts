import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import {
  FeedbackSubmitEvent,
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
  implements OnInit, OnChanges, OnDestroy {
  roleplayPhase = true;
  feedbackPhase = false;
  giveFeedback = false;
  rplayTimer: Timer;
  feedbackTimer: Timer;
  timerInterval;
  currentUser: User;
  answersSubmitted = false;

  constructor(private emoji: EmojiLookupService) {
    super();
  }

  ngOnInit() {
    this.timerInterval = setInterval(() => this.checkTimer(), 100);
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  ngOnChanges() {
    this.currentUser = this.activityState.your_identity;
    if (!this.giveFeedback) {
      this.setupTimer();
    }
  }

  setupTimer() {
    const actTimer = this.activityState.genericroleplayactivity
      .activity_countdown_timer;
    const fbackBuffer = this.activityState.genericroleplayactivity
      .feedback_buffer;

    this.rplayTimer = {
      id: actTimer.id,
      status: actTimer.status,
      start_time: actTimer.start_time,
      end_time: moment(actTimer.end_time)
        .subtract(fbackBuffer, 'seconds')
        .format(),
      remaining_seconds: actTimer.remaining_seconds - fbackBuffer,
      total_seconds: actTimer.total_seconds - fbackBuffer
    };
  }

  checkTimer() {
    const actTimer: Timer = this.activityState.genericroleplayactivity
      .activity_countdown_timer;
    const fbackBuffer = this.activityState.genericroleplayactivity
      .feedback_buffer;

    if (
      moment(this.rplayTimer.end_time).isSameOrBefore(moment()) ||
      actTimer.remaining_seconds - fbackBuffer <= 0
    ) {
      this.giveFeedback = true;
      this.feedbackTimer = {
        id: actTimer.id,
        status: actTimer.status,
        start_time: moment().format(),
        end_time: actTimer.end_time,
        remaining_seconds: actTimer.remaining_seconds,
        total_seconds: fbackBuffer
      };
    }
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
    // role.feedbackquestions = [
    //   {
    //     id: 227,
    //     question_type: 'rating_agreedisagree',
    //     question_text: 'The pitch was concise',
    //     is_combo: false,
    //     combo_text: null
    //   },
    //   {
    //     id: 228,
    //     question_type: 'rating_agreedisagree',
    //     question_text: 'The delivery was strong',
    //     is_combo: false,
    //     combo_text: null
    //   },
    //   {
    //     id: 229,
    //     question_type: 'rating_agreedisagree',
    //     question_text: 'How would you rate the pitch overall?',
    //     is_combo: false,
    //     combo_text: null
    //   },
    //   {
    //     id: 230,
    //     question_type: 'text',
    //     question_text: 'Do you have any other comments?',
    //     is_combo: false,
    //     combo_text: null
    //   }
    // ];
    return role;
  }

  isObserver() {
    const participantRole: RoleplayRole = this.getParticipantRole();
    const userSet = this.activityState.genericroleplayactivity
      .genericroleplayuser_set;
    if (participantRole.name === 'Observer') {
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
    this.sendMessage.emit(new GenericRoleplayUserFeedbackEvent(answers));
    this.answersSubmitted = true;
  }
}

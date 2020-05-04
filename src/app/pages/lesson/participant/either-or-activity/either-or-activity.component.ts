import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import {
  BackendRestService,
  ContextService,
  EitherOrActivityService,
  EmojiLookupService,
} from 'src/app/services';
import {
  User,
  WhereDoYouStandActivity,
  WhereDoYouStandChoice,
  WhereDoYouStandSubmitPredictionEvent,
  WhereDoYouStandSubmitPreferenceEvent,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-either-or-activity',
  templateUrl: './either-or-activity.component.html',
  styleUrls: ['./either-or-activity.component.scss'],
})
export class ParticipantEitherOrActivityComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  state: WhereDoYouStandActivity;
  selectedPreference;
  selectedPrediction;
  user: User;
  choice = null;

  constructor(
    private emoji: EmojiLookupService,
    private restService: BackendRestService,
    private eitherOrActivityService: EitherOrActivityService,
    private contextService: ContextService
  ) {
    super();
  }

  ngOnInit() {
    this.user = this.activityState.your_identity;
    this.state = this.activityState.wheredoyoustandactivity;
  }

  choosePrediction(choice): void {
    this.selectedPrediction = choice.id;
    this.sendMessage.emit(new WhereDoYouStandSubmitPredictionEvent(choice));
  }

  choosePreference(choice): void {
    this.selectedPreference = choice.id;
    this.sendMessage.emit(new WhereDoYouStandSubmitPreferenceEvent(choice));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.state = this.activityState.wheredoyoustandactivity;
    if (
      this.state.prediction_extra_countdown_timer &&
      this.state.prediction_extra_countdown_timer.status !== 'ended' &&
      !this.state.prediction_extra_time_complete
    ) {
      // Show prediction extra time modal
      const timer = this.state.prediction_extra_countdown_timer;
      this.contextService.activityTimer = timer;
    } else if (
      this.state.prediction_complete &&
      this.state.user_preferences.length === 0 &&
      this.state.preference_extra_countdown_timer === null
    ) {
      // Show user preferences screen
      this.resetChoices();
      this.contextService.activityTimer = this.state.preference_countdown_timer;
    } else if (
      this.state.preference_extra_countdown_timer &&
      this.state.preference_extra_countdown_timer.status !== 'ended' &&
      !this.state.preference_extra_time_complete
    ) {
      // Show preferences extra countdown timer
      const timer = this.state.preference_extra_countdown_timer;
      this.contextService.activityTimer = timer;
    } else if (
      this.state.prediction_complete &&
      this.state.preference_complete &&
      !this.state.standing_complete
    ) {
      // Show stand on side sceen
      this.resetChoices();
      this.contextService.activityTimer = this.state.stand_on_side_countdown_timer;
    } else if (
      !this.state.standing_complete &&
      !this.predictionComplete() &&
      !this.preferenceComplete()
    ) {
      this.contextService.activityTimer = this.state.prediction_countdown_timer;
    }
  }

  predictionComplete(): boolean {
    return (
      this.state.prediction_complete &&
      (this.state.prediction_extra_time_complete ||
        this.state.prediction_extra_time_complete === null)
    );
  }

  preferenceComplete(): boolean {
    return (
      this.state.preference_complete &&
      (this.state.preference_extra_time_complete ||
        this.state.preference_extra_time_complete === null)
    );
  }

  getUserPreferredChoice() {
    const pref = this.activityState.wheredoyoustandactivity.user_preferences.find(
      (p) => {
        return p.user.id === this.user.id;
      }
    );

    if (pref) {
      return pref.wheredoyoustandchoice;
    } else {
      return undefined;
    }
  }

  getGroupPreferredChoice(): WhereDoYouStandChoice {
    return this.eitherOrActivityService.getGroupChoice(
      this.state,
      'num_preferences'
    );
  }

  resetChoices(): void {
    this.choice = null;
  }

  getUserSide(): string {
    const choice = this.getUserPreferredChoice();
    if (
      choice.id === this.activityState.wheredoyoustandactivity.left_choice.id
    ) {
      return 'left';
    } else {
      return 'right';
    }
  }

  getUserPredictedChoice() {
    const predictions = this.state.user_predictions;
    const userPrediction = predictions.find((p) => p.user.id === this.user.id);
    if (userPrediction) {
      return userPrediction.wheredoyoustandchoice;
    } else {
      return undefined;
    }
  }

  getGroupPercentagePreference() {
    const numberOfUsers = this.activityState.lesson_run.joined_users.length;

    const groupPreference = Math.max.apply(
      Math,
      this.state.choice_stats.map(function (o) {
        return o.num_preferences;
      })
    );

    return Math.trunc((groupPreference / numberOfUsers) * 100);
  }

  evaluateUserPrediction(): string {
    const groupPreference = this.getGroupPreferredChoice();
    const userPrediction = this.getUserPredictedChoice();
    if (userPrediction === undefined) {
      return undefined;
    }

    if (groupPreference.id === userPrediction.id) {
      return 'correct :)';
    } else {
      return 'incorrect :(';
    }
  }
}

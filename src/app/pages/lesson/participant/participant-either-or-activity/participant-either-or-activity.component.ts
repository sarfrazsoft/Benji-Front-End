import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  BackendRestService,
  EitherOrActivityService,
  EmojiLookupService
} from 'src/app/services';
import {
  WhereDoYouStandActivity,
  WhereDoYouStandChoice
} from 'src/app/services/backend/schema/activities';
import {
  WhereDoYouStandSubmitPredictionEvent,
  WhereDoYouStandSubmitPreferenceEvent
} from 'src/app/services/backend/schema/messages';
import { User } from 'src/app/services/backend/schema/user';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-participant-either-or-activity',
  templateUrl: './participant-either-or-activity.component.html',
  styleUrls: ['./participant-either-or-activity.component.scss']
})
export class ParticipantEitherOrActivityComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  state: WhereDoYouStandActivity;
  user: User;
  choice = null;

  constructor(
    private emoji: EmojiLookupService,
    private restService: BackendRestService,
    private eitherOrActivityService: EitherOrActivityService
  ) {
    super();
  }

  ngOnInit() {
    this.user = this.activityState.your_identity;
    this.state = this.activityState.wheredoyoustandactivity;
    console.log(this.activityState);
  }

  choosePrediction(choice): void {
    this.sendMessage.emit(new WhereDoYouStandSubmitPredictionEvent(choice));
  }

  choosePreference(choice): void {
    this.sendMessage.emit(new WhereDoYouStandSubmitPreferenceEvent(choice));
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.activityState);
    this.state = this.activityState.wheredoyoustandactivity;
    if (
      this.state.prediction_extra_countdown_timer &&
      this.state.prediction_extra_countdown_timer.status !== 'ended' &&
      !this.state.prediction_extra_time_complete
    ) {
      // Show prediction extra time modal
    } else if (
      this.state.prediction_complete &&
      this.state.user_preferences.length === 0 &&
      this.state.preference_extra_countdown_timer === null
    ) {
      // Show user preferences screen
      this.resetChoices();
    } else if (
      this.state.preference_extra_countdown_timer &&
      this.state.preference_extra_countdown_timer.status !== 'ended' &&
      !this.state.preference_extra_time_complete
    ) {
      // Show preferences extra countdown timer
    } else if (
      this.state.prediction_complete &&
      this.state.preference_complete &&
      !this.state.standing_complete
    ) {
      // Show stand on side sceen
      this.resetChoices();
    } else if (
      this.state.prediction_complete &&
      this.state.preference_complete &&
      this.state.standing_complete
    ) {
    }
    console.log(this.activityState);
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
      p => {
        return p.user.id === this.user.id;
      }
    );

    console.log(pref);
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
    const userPrediction = predictions.find(p => p.user.id === this.user.id);
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
      this.state.choice_stats.map(function(o) {
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

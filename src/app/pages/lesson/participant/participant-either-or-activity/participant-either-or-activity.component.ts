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
      this.state.prediction_complete &&
      this.state.user_preferences.length === 0
    ) {
      this.resetChoices();
    }
  }

  getUserPreferredChoice(): WhereDoYouStandChoice {
    const pref = this.activityState.wheredoyoustandactivity.user_preferences.find(
      p => {
        return p.user.id === this.user.id;
      }
    );

    console.log(pref);
    return pref.wheredoyoustandchoice;
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

  getUserPredictedChoice(): WhereDoYouStandChoice {
    const predictions = this.state.user_predictions;
    const userPrediction = predictions.find(p => p.user.id === this.user.id);
    return userPrediction.wheredoyoustandchoice;
  }

  evaluateUserPrediction(): string {
    const groupPreference = this.getGroupPreferredChoice();
    const userPrediction = this.getUserPredictedChoice();

    if (groupPreference.id === userPrediction.id) {
      return 'correct :)';
    } else {
      return 'incorrect :(';
    }
  }
}

import {
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { EitherOrActivityService, EmojiLookupService } from 'src/app/services';
import {
  WhereDoYouStandActivity,
  WhereDoYouStandChoice
} from 'src/app/services/backend/schema/activities';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-main-screen-either-or-activity',
  templateUrl: './main-screen-either-or-activity.component.html',
  styleUrls: ['./main-screen-either-or-activity.component.scss']
})
export class MainScreenEitherOrActivityComponent extends BaseActivityComponent
  implements OnInit, AfterViewInit, OnChanges {
  state: WhereDoYouStandActivity;
  @ViewChild('timer') timer;

  constructor(
    private emoji: EmojiLookupService,
    private eitherOrActivityService: EitherOrActivityService
  ) {
    super();
  }

  ngOnInit() {
    this.state = this.activityState.wheredoyoustandactivity;
    console.log(this.activityState);
  }

  ngAfterViewInit() {
    this.initTimer('prediction_countdown_timer');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.state = this.activityState.wheredoyoustandactivity;
    if (
      this.state.prediction_complete &&
      this.state.user_preferences.length === 0
    ) {
      this.initTimer('preference_countdown_timer');
    } else if (
      this.state.prediction_complete &&
      this.state.preference_complete
    ) {
      this.initTimer('stand_on_side_countdown_timer');
    }
    console.log(this.activityState);
  }

  initTimer(timerProperty: string) {
    this.timer.startTimer(0);
    const seconds =
      (Date.parse(this.state[timerProperty].end_time) - Date.now()) / 1000;
    this.timer.startTimer(seconds);
  }

  getGroupPreferredChoice(): WhereDoYouStandChoice {
    return this.eitherOrActivityService.getGroupChoice(
      this.state,
      'num_preferences'
    );
  }

  getGroupPredictionChoice(): WhereDoYouStandChoice {
    return this.eitherOrActivityService.getGroupChoice(
      this.state,
      'num_predictions'
    );
  }

  getGroupPercentagePrediction() {
    const numberOfUsers = this.activityState.lesson_run.joined_users.length;

    const groupPrediction = Math.max.apply(
      Math,
      this.state.choice_stats.map(function(o) {
        return o.num_predictions;
      })
    );

    return Math.trunc((groupPrediction / numberOfUsers) * 100);
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

  getGroupPredictionEvaluation(): boolean {
    const preferredChoice = this.getGroupPreferredChoice();
    const predictedChoice = this.getGroupPredictionChoice();
    return preferredChoice.id === predictedChoice.id;
  }
}

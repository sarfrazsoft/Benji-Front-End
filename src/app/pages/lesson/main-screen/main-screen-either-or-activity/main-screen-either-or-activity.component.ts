import {
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EitherOrActivityService, EmojiLookupService } from 'src/app/services';
import {
  WhereDoYouStandActivity,
  WhereDoYouStandChoice
} from 'src/app/services/backend/schema/activities';
import { Timer } from 'src/app/services/backend/schema/utils';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import { LowResponseDialogComponent } from '../../shared/dialogs';

@Component({
  selector: 'benji-main-screen-either-or-activity',
  templateUrl: './main-screen-either-or-activity.component.html',
  styleUrls: ['./main-screen-either-or-activity.component.scss']
})
export class MainScreenEitherOrActivityComponent extends BaseActivityComponent
  implements OnInit, AfterViewInit, OnChanges {
  state: WhereDoYouStandActivity;
  dialogRef;
  @ViewChild('timer') timer;

  constructor(
    private emoji: EmojiLookupService,
    private eitherOrActivityService: EitherOrActivityService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.state = this.activityState.wheredoyoustandactivity;
    console.log(this.activityState);
  }

  ngAfterViewInit() {
    this.initTimer(this.state.prediction_countdown_timer.end_time);
  }

  openLowResponseDialog(timer: Timer): void {
    this.dialogRef = this.dialog
      .open(LowResponseDialogComponent, {
        data: { timer: timer },
        disableClose: true,
        panelClass: 'low-response-dialog'
      })
      .afterClosed()
      .subscribe(res => {
        console.log(res);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.state = this.activityState.wheredoyoustandactivity;
    if (
      this.state.prediction_extra_countdown_timer &&
      this.state.prediction_extra_countdown_timer.status !== 'ended' &&
      !this.state.prediction_extra_time_complete
    ) {
      if (!this.dialogRef) {
        this.openLowResponseDialog(this.state.prediction_extra_countdown_timer);
      }
    } else if (
      this.state.prediction_complete &&
      this.state.user_preferences.length === 0 &&
      this.state.preference_extra_countdown_timer === null
    ) {
      this.dialog.closeAll();
      this.dialogRef = undefined;
      this.initTimer(this.state.preference_countdown_timer.end_time);
    } else if (
      this.state.preference_extra_countdown_timer &&
      this.state.preference_extra_countdown_timer.status !== 'ended' &&
      !this.state.preference_extra_time_complete
    ) {
      if (!this.dialogRef) {
        this.openLowResponseDialog(this.state.preference_extra_countdown_timer);
      }
    } else if (
      this.state.prediction_complete &&
      this.state.preference_complete &&
      !this.state.standing_complete
    ) {
      this.dialog.closeAll();
      this.dialogRef = undefined;
      this.initTimer(this.state.stand_on_side_countdown_timer.end_time);
    } else if (
      this.state.prediction_complete &&
      this.state.preference_complete &&
      this.state.standing_complete
    ) {
      this.initTimer(
        this.activityState.base_activity.next_activity_start_timer.end_time
      );
    }
    console.log(this.activityState);
  }

  initTimer(endTime: string) {
    this.timer.startTimer(0);
    const seconds = (Date.parse(endTime) - Date.now()) / 1000;
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

  getGroupPredictionEvaluation(): string {
    if (this.getGroupPercentagePreference() === 50) {
      return 'Tie!';
    }
    const preferredChoice = this.getGroupPreferredChoice();
    const predictedChoice = this.getGroupPredictionChoice();
    return preferredChoice.id === predictedChoice.id
      ? 'Correct!'
      : 'Incorrect!';
  }

  isGroupPredictionEvaluationTie(): boolean {
    if (this.getGroupPredictionEvaluation() === 'Tie!') {
      return true;
    }
    return false;
  }
}

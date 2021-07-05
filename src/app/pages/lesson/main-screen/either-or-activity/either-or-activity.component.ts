import {
  AfterViewInit,
  Component,
  HostListener,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EitherOrActivityService, EmojiLookupService } from 'src/app/services';
import {
  FastForwardEvent,
  NextInternalEvent,
  Timer,
  User,
  WhereDoYouStandActivity,
  WhereDoYouStandChoice,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import { LowResponseDialogComponent } from '../../shared/dialogs';

@Component({
  selector: 'benji-ms-either-or-activity',
  templateUrl: './either-or-activity.component.html',
})
export class MainScreenEitherOrActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {
  state: WhereDoYouStandActivity;
  hideResultEmoji = false;
  dialogRef;
  rightChoiceUsers: Array<number> = [];
  leftChoiceUsers: Array<number> = [];
  isRemoteSession = true;
  @ViewChild('timer') timer;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    if (window.innerWidth < 1400) {
      this.hideResultEmoji = true;
    } else {
      this.hideResultEmoji = false;
    }
  }

  constructor(
    private emoji: EmojiLookupService,
    private eitherOrActivityService: EitherOrActivityService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    console.log(this.activityState);
    this.state = this.activityState.wheredoyoustandactivity;

    if (window.innerWidth < 1400) {
      this.hideResultEmoji = true;
    } else {
      this.hideResultEmoji = false;
    }
  }

  openLowResponseDialog(timer: Timer): void {
    this.dialogRef = this.dialog
      .open(LowResponseDialogComponent, {
        data: { timer: timer },
        disableClose: true,
        panelClass: 'low-response-dialog',
      })
      .afterClosed()
      .subscribe((res) => {});
  }

  ngOnChanges(changes: SimpleChanges) {
    this.state = this.activityState.wheredoyoustandactivity;
    this.leftChoiceUsers = [];
    this.rightChoiceUsers = [];
    this.state.preferences.forEach((p) => {
      if (p.wheredoyoustandchoice.id === this.state.left_choice.id) {
        this.leftChoiceUsers.push(p.participant.participant_code);
      } else {
        this.rightChoiceUsers.push(p.participant.participant_code);
      }
    });
    if (
      this.state.prediction_extra_countdown_timer &&
      this.state.prediction_extra_countdown_timer.status !== 'ended' &&
      !this.state.prediction_extra_time_complete
    ) {
      // if (!this.dialogRef) {
      //   this.openLowResponseDialog(this.state.prediction_extra_countdown_timer);
      // }
      // if extra timer starts running fast forward it
      this.sendMessage.emit(new FastForwardEvent());
    } else if (
      this.state.prediction_complete &&
      this.state.preferences.length === 0 &&
      this.state.preference_extra_countdown_timer === null
    ) {
      if (this.dialog) {
        this.dialog.closeAll();
        this.dialogRef = undefined;
      }
    } else if (
      this.state.preference_extra_countdown_timer &&
      this.state.preference_extra_countdown_timer.status !== 'ended' &&
      !this.state.preference_extra_time_complete
    ) {
      // if (!this.dialogRef) {
      //   this.openLowResponseDialog(this.state.preference_extra_countdown_timer);
      // }
      // if extra timer starts running fast forward it
      this.sendMessage.emit(new FastForwardEvent());
    } else if (
      this.state.prediction_complete &&
      this.state.preference_complete &&
      !this.state.standing_complete
    ) {
      this.sendMessage.emit(new FastForwardEvent());
      // if (this.dialog) {
      //   this.dialog.closeAll();
      //   this.dialogRef = undefined;
      // }
    }
  }

  getGroupPreferredChoice(): WhereDoYouStandChoice {
    return this.eitherOrActivityService.getGroupChoice(this.state, 'num_preferences');
  }

  getGroupPredictionChoice(): WhereDoYouStandChoice {
    return this.eitherOrActivityService.getGroupChoice(this.state, 'num_predictions');
  }

  getGroupPercentagePrediction() {
    const numberOfUsers = this.activityState.lesson_run.participant_set.length;
    let numberOfUsersWhoPredicted;

    const groupPrediction = Math.max.apply(
      Math,
      this.state.choice_stats.map(function (o) {
        return o.num_predictions;
      })
    );

    numberOfUsersWhoPredicted =
      this.state.choice_stats[0].num_predictions + this.state.choice_stats[1].num_predictions;

    return Math.trunc((groupPrediction / numberOfUsers) * 100);
  }

  getGroupPercentagePreference() {
    const numberOfUsers = this.activityState.lesson_run.participant_set.length;

    const groupPreference = Math.max.apply(
      Math,
      this.state.choice_stats.map(function (o) {
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
    return preferredChoice.id === predictedChoice.id ? 'Correct!' : 'Incorrect!';
  }

  isGroupPredictionEvaluationTie(): boolean {
    if (this.getGroupPredictionEvaluation() === 'Tie!') {
      return true;
    }
    return false;
  }

  continueClicked() {
    // this.sendMessage.emit(new NextInternalEvent());
    this.sendMessage.emit(new FastForwardEvent());
  }
}

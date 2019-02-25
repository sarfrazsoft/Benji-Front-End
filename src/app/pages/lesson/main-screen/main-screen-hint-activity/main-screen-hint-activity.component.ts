import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'app-main-screen-hint-activity',
  templateUrl: './main-screen-hint-activity.component.html',
  styleUrls: ['./main-screen-hint-activity.component.scss']
})
export class MainScreenHintActivityComponent extends BaseActivityComponent
  implements OnChanges {
  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;
  sfxFile;

  submitTimerInit(timer) {
    const submitTotalTime =
      Date.parse(this.activityState.hintwordactivity.submission_countdown_timer.expiration_time) -
      Date.now();
    const submitTimeElapsed = 0;
    timer.startTimer(submitTotalTime, submitTimeElapsed);
  }

  voteTimerInit(timer) {
    const voteTotalTime =
      Date.parse(this.activityState.hintwordactivity.voting_countdown_timer.expiration_time) -
      Date.now();
    const voteTimeElapsed = 0;
    timer.startTimer(voteTotalTime, voteTimeElapsed);
  }

  startEndTimer(timer) {
    const endTotalSeconds =
      (Date.parse(this.activityState.base_activity.next_activity_start_timer.expiration_time) -
        Date.now()) /
      1000;
    timer.startTimer(endTotalSeconds);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['activityState'] &&
      changes['activityState'].previousValue &&
      changes['activityState'].previousValue.hintwordactivity.words_and_votes
        .length <
        changes['activityState'].currentValue.hintwordactivity.words_and_votes
          .length
    ) {
      this.playSfx('voteSubmitted');
    }

    if (
      changes['activityState'] &&
      changes['activityState'].previousValue &&
      changes['activityState'].previousValue.hintwordactivity.voting_complete !==
        changes['activityState'].currentValue.hintwordactivity.voting_complete
    ) {
      this.playSfx('revealWinner');
    }
  }

  private playSfx(sfxType: string) {
    if (sfxType === 'voteSubmitted') {
      this.sfxFile = `../../../../../assets/audio/191678__porphyr__waterdrop.wav`;
    } else if (sfxType === 'revealWinner') {
      this.sfxFile = '../../../../../assets/audio/Answers Submitted.mp3';
    }
    this.sfxPlayer.nativeElement.load();
    this.sfxPlayer.nativeElement.play();
  }

  countVotes() {
    return  this.activityState.hintwordactivity.words_and_votes.map(
      w => w.votes).reduce((partial_sum, a) => partial_sum + a);
  }
}

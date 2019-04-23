import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-hint-activity',
  templateUrl: './hint-activity.component.html',
  styleUrls: ['./hint-activity.component.scss']
})
export class MainScreenHintActivityComponent extends BaseActivityComponent
  implements OnChanges {
  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;
  sfxFile;

  startEndTimer(timer) {
    const endTotalSeconds =
      (Date.parse(
        this.activityState.base_activity.next_activity_start_timer.end_time
      ) -
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
      changes['activityState'].previousValue.hintwordactivity
        .voting_complete !==
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
    return this.activityState.hintwordactivity.words_and_votes
      .map(w => w.votes)
      .reduce((partial_sum, a) => partial_sum + a);
  }
}

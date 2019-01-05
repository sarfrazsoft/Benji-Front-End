import {Component, OnInit, ViewChild, ElementRef, SimpleChanges, OnChanges} from '@angular/core';
import {BaseActivityComponent} from '../../shared/base-activity.component';

@Component({
  selector: 'app-main-screen-hint-activity',
  templateUrl: './main-screen-hint-activity.component.html',
  styleUrls: ['./main-screen-hint-activity.component.scss']
})
export class MainScreenHintActivityComponent extends BaseActivityComponent implements OnChanges {

  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;
  sfxFile;

  submitTimerInit(timer) {
    const submitTotalTime = Date.parse(this.activityState.activity_status.submission_countdown) - Date.now();
    const submitTimeElapsed = 0;
    timer.startTimer(submitTotalTime, submitTimeElapsed);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activityState'] && changes['activityState'].previousValue &&
                (changes['activityState'].previousValue.activity_status.submitted_words.length <
                changes['activityState'].currentValue.activity_status.submitted_words.length)) {
      this.playSfx('voteSubmitted');
    }

    if (changes['activityState'] && changes['activityState'].previousValue &&
      (changes['activityState'].previousValue.activity_status.voting_complete !==
        changes['activityState'].currentValue.activity_status.voting_complete)) {
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
}

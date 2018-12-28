import {Component, OnInit, ViewChild, ElementRef, SimpleChanges, OnChanges} from '@angular/core';
import {BaseActivityComponent} from '../../shared/base-activity.component';

@Component({
  selector: 'app-main-screen-hint-activity',
  templateUrl: './main-screen-hint-activity.component.html',
  styleUrls: ['./main-screen-hint-activity.component.scss']
})
export class MainScreenHintActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {

  submitTotalTime: number;
  submitTimeElapsed: number;
  submitInterval;

  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;
  sfxFile;

  ngOnInit() {
    this.submitTotalTime = Date.parse(this.activityState.activity_status.submission_countdown) - Date.now();
    this.submitTimeElapsed = 0;

    this.submitInterval = setInterval(() => {
      if (this.submitTimeElapsed < this.submitTotalTime) {
        this.submitTimeElapsed += 100;
      } else {
        this.submitTimeElapsed = this.submitTotalTime;
        clearInterval(this.submitInterval);
      }
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activityState'] &&
                (changes['activityState'].previousValue.activity_status.submitted_words.length <
                changes['activityState'].currentValue.activity_status.submitted_words.length)) {
      this.playSfx('voteSubmitted');
    }

    if (changes['activityState'] &&
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

import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'app-main-screen-mcq-activity',
  templateUrl: './main-screen-mcq-activity.component.html',
  styleUrls: ['./main-screen-mcq-activity.component.scss']
})
export class MainScreenMcqActivityComponent extends BaseActivityComponent
  implements OnChanges {
  @ViewChild('revealTimer') revealTimer;
  pauseSeconds;

  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;
  sfxFile: string;

  initQuestionTimer(timer) {
    const questionTotalTime =
      Date.parse(this.activityState.activity_status.countdown_time) -
      Date.now();
    const questionElapsedTime = 0;
    timer.startTimer(questionTotalTime, questionElapsedTime);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['activityState'] &&
      changes['activityState'].previousValue &&
      (changes['activityState'].previousValue.activity_status.pause_time ===
        null ||
        changes['activityState'].previousValue.activity_status.pause_time ===
          undefined) &&
      (changes['activityState'].currentValue.activity_status.pause_time !==
        null &&
        changes['activityState'].currentValue.activity_status.pause_time !==
          undefined)
    ) {
      this.playSfx('revealAnswer');
    }
  }

  startRevealTimer(timer) {
    this.pauseSeconds =
      (Date.parse(this.activityState.activity_status.pause_time) - Date.now()) /
      1000;
    timer.startTimer();
  }

  reveal() {
    return (
      this.activityState.activity_status.pause_time !== null &&
      this.activityState.activity_status.pause_time !== undefined
    );
  }

  correctChoice() {
    return this.activityState.activity_status.question.choices.find(
      choice => choice.is_correct
    );
  }

  private playSfx(sfxType: string) {
    if (sfxType === 'revealAnswer') {
      this.sfxFile = `../../../../../assets/audio/Time's Up.wav`;
    } else if (sfxType === 'answerDetail') {
      this.sfxFile = '../../../../../assets/audio/Answers Submitted.mp3';
    }
    this.sfxPlayer.nativeElement.load();
    this.sfxPlayer.nativeElement.play();
  }
}

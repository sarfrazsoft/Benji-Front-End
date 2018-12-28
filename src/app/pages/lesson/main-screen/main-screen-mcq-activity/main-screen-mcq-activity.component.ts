import {Component, OnInit, ElementRef, ViewChild, OnChanges, SimpleChanges} from '@angular/core';
import {BaseActivityComponent} from '../../shared/base-activity.component';

@Component({
  selector: 'app-main-screen-mcq-activity',
  templateUrl: './main-screen-mcq-activity.component.html',
  styleUrls: ['./main-screen-mcq-activity.component.scss']
})
export class MainScreenMcqActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {

  questionTotalTime: number;
  questionElapsedTime: number;
  questionInterval;

  @ViewChild('revealTimer') revealTimer;
  pauseSeconds;

  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;
  sfxFile: string;

  ngOnInit() {
    this.questionTotalTime = Date.parse(this.activityState.activity_status.countdown_time) - Date.now();
    this.questionElapsedTime = 0;

    this.questionInterval = setInterval(() => {
      if (this.questionElapsedTime < this.questionTotalTime) {
        this.questionElapsedTime += 100;
      } else {
        this.questionElapsedTime = this.questionTotalTime;
        clearInterval(this.questionInterval);
      }
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activityState'] &&
      (changes['activityState'].previousValue.activity_status.pause_time === null || changes['activityState'].previousValue.activity_status.pause_time === undefined) &&
      (changes['activityState'].currentValue.activity_status.pause_time !== null && changes['activityState'].currentValue.activity_status.pause_time !== undefined)) {
      this.pauseSeconds = (Date.parse(this.activityState.activity_status.pause_time) - Date.now()) / 1000;
      this.revealTimer.startTimer();
      this.playSfx('revealAnswer');
    }
  }

  reveal() {
    return this.activityState.activity_status.pause_time !== null && this.activityState.activity_status.pause_time !== undefined;
  }

  correctChoice() {
    return this.activityState.activity_status.question.choices.find((choice) => choice.is_correct );
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

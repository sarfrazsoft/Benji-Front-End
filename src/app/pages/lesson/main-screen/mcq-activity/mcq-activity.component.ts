// TODO remove activity if not used
import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-mcq-activity',
  templateUrl: './mcq-activity.component.html',
  styleUrls: ['./mcq-activity.component.scss'],
})
export class MainScreenMcqActivityComponent extends BaseActivityComponent implements OnChanges {
  pauseSeconds;

  @ViewChild('sfxPlayer', { static: false }) sfxPlayer: ElementRef;
  sfxFile: string;

  ngOnChanges(changes: SimpleChanges) {}

  reveal() {}

  correctChoice() {
    return this.activityState.mcqactivity.question.mcqchoice_set.find((choice) => choice.is_correct);
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

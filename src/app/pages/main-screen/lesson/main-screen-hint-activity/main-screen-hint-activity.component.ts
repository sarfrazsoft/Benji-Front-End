import { Component, OnInit, Renderer2, ViewChild, ElementRef, ViewChildren, AfterViewInit, Input } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { interval } from 'rxjs';

@Component({
  selector: 'app-main-screen-hint-activity',
  templateUrl: './main-screen-hint-activity.component.html',
  styleUrls: ['./main-screen-hint-activity.component.scss']
})
export class MainScreenHintActivityComponent implements OnInit, AfterViewInit {

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  public voteFontSize = 47;
  public totalSeconds;
  public initialTimeRemaining;
  public secondsElapsed;
  public secondsElapsedInterval;
  public intervalSubscription;
  public words = [];
  public activityState;
  public winningWord;
  public instructions;
  public expectedNumberOfWords;
  public votingDone;
  public sfxFile;

  @ViewChild('listParent') listParent: ElementRef;
  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;

  @Input() set socketData(data) {
    const activity = data.message.activity_status;
    this.expectedNumberOfWords = data.message.participants.length;
    if (activity.submitted_words > 0 && this.winningWord === undefined) {
      this.playSfx('voteSubmitted');
    }
    this.words = activity.submitted_words;
    this.instructions = activity.instructions;
    const countdown = Date.parse(activity.submission_countdown) - Date.now();
    console.log(countdown);
    if (this.totalSeconds === undefined) {
      this.totalSeconds = (countdown / 1000);
      this.initialTimeRemaining = (countdown / 1000);
      this.secondsElapsed = 0;
      console.log(`${this.totalSeconds} left until vote`);
      this.secondsElapsedInterval = interval(100);

      this.intervalSubscription = this.secondsElapsedInterval.pipe(
        takeWhile((time: number) => time / 10 < this.initialTimeRemaining),
        takeWhile(() => !this.votingDone)
      );
      this.intervalSubscription.subscribe((time) => {
        this.secondsElapsed = time;
      });
    }
    if (this.expectedNumberOfWords === this.words.length) {
      this.secondsElapsed = this.totalSeconds * 10;
      this.votingDone = true;
    }

    if (activity.submission_complete && activity.voting_complete) {
      this.playSfx('revealWinner');
      this.winningWord = activity.voted_word;
      this.activityState = 'complete';
    }

  }



  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  private scaleList() {
    const maxHeightAllowed = (this.listParent.nativeElement.offsetHeight * .8);
    let wordsTotalHeight = 0;
    const listItems = this.el.nativeElement.querySelectorAll('.hint-activity__option');
    for (let i = 0; i < listItems.length; ++i) {
      wordsTotalHeight += listItems[i].offsetHeight;
    }
    if (wordsTotalHeight >= maxHeightAllowed) {
      const currentFontSize = parseInt(window.getComputedStyle(this.el.nativeElement.querySelector('.hint-activity__option')).fontSize, 10);

      const newFontSize = currentFontSize * .9;
      this.voteFontSize = newFontSize;
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

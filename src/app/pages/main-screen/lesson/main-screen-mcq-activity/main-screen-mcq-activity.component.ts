import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { interval, of } from 'rxjs';
import { tap, takeWhile } from 'rxjs/operators';
import { startTimeRange } from '@angular/core/src/profile/wtf_impl';

@Component({
  selector: 'app-main-screen-mcq-activity',
  templateUrl: './main-screen-mcq-activity.component.html',
  styleUrls: ['./main-screen-mcq-activity.component.scss']
})
export class MainScreenMcqActivityComponent implements OnInit {

  @Input() set socketData(data) {
    const activity = data.message.activity_status;
    const questionTimer = activity.countdown_time;
    const nextPhaseTimer = activity.pause_time;

    if (nextPhaseTimer === null) {
      this.question = activity.question.question;
      this.answerSet = activity.question.choices;
      this.correctAnswerExplanation = this.getExplanation(this.answerSet);
      if (!this.timerStarted) {
        this.startTimer(questionTimer);
      }
    }

    if (nextPhaseTimer !== null && !this.answerDetailState) {
      this.playSfx('revealAnswer');
      this.revealAnswer = true;
      setTimeout(() => {
        this.playSfx('answerDetail');
        this.answerDetailState = true;
        this.setNextPhaseTimer(nextPhaseTimer);
      }, 3000);
    }



  }

  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;
  public question;
  public answerSet;

  public secondsElapsed;
  public totalSeconds;
  private secondsElapsedInterval: any;
  private intervalSubscription;
  public revealAnswer;
  public answerDetailState;
  public nextPhaseTimeRemaining;
  public correctAnswerExplanation;
  public timerStarted;
  public sfxFile: string;

  constructor() {
  }

  ngOnInit() {
  }

  private startTimer(timer) {
   const timerPromise = of(
     this.setupTimer(timer, this.onTimesUp)
    ).toPromise();

    timerPromise.then(() => {
      setTimeout(() => {
        this.intervalSubscription.subscribe(time => {
          this.secondsElapsed = time;
          this.timerStarted = true;
        });
      }, 100);
    });
  }

  private onTimesUp(scope) {
    setTimeout(() => {
      // scope.revealAnswer = true;
    }, 200);
  }

  private setNextPhaseTimer(dateTimeString?) {
    setTimeout(() => {
      const countdown = Date.parse(dateTimeString) - Date.now();
      this.nextPhaseTimeRemaining = countdown / 1000;
    }, 100);
  }

  private setupTimer(timer, callback?) {
    const _scope = this;
    const countdown = Date.parse(timer) - Date.now();
    this.secondsElapsed = 0;
    this.totalSeconds = countdown / 1000;
    this.secondsElapsedInterval = interval(100);
    this.intervalSubscription = this.secondsElapsedInterval.pipe(
      tap((time: number) => {
        if (time / 10 >= this.totalSeconds && callback) {
          callback(_scope);
        }
      }),
      takeWhile((time: number) => time / 10 < this.totalSeconds),
      takeWhile(() => !this.revealAnswer),
    );
  }

  private getExplanation(answerSet) {
    const correctObject = answerSet.find(function(choiceObject) {
      return choiceObject.is_correct === true;
    });

    return correctObject.explanation_text;
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

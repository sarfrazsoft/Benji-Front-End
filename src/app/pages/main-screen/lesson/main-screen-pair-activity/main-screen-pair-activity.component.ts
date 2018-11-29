import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { interval } from 'rxjs';
import { EmojiLookupService } from "src/app/services/emoji-lookup.service";
import { takeLast, take, takeUntil, takeWhile } from "rxjs/operators";


@Component({
  selector: "app-main-screen-pair-activity",
  templateUrl: "./main-screen-pair-activity.component.html",
  styleUrls: ["./main-screen-pair-activity.component.scss"]
})
export class MainScreenPairActivityComponent implements OnInit {

  public pairGameStarted = false;
  public timer;
  public foundPairsSet;
  public primaryRole;
  public secondaryRole;
  public roleplayQuestion;
  public secondsElapsed = 0;
  public secondsElapsedInterval;
  public totalSeconds;
  public data;
  private initialTimeRemaining: number;
  public primaryEmoji;
  public secondaryEmoji;
  public _reversed: boolean;
  private intervalSubscription;
  @ViewChild('sfxPlayer') sfxPlyaer: ElementRef;

  @Input()
  participants: any[];
  @Input() set socketData(data) {
    this.primaryRole =  data.message.activity_status.primary_role;
    this.secondaryRole = data.message.activity_status.secondary_role;
    this.roleplayQuestion = data.message.activity_status.roleplay_question;
    console.log(this.roleplayQuestion);
    this.data = data;
  }
  @Input()
  userPairs: any[];

  @Input()
  set foundPairs(pairs) {
    console.log(pairs)
    this.updateFoundPairs(pairs);
    this.foundPairsSet = pairs;
  }

  @Input()
  set startTime(value) {
    console.log('new start time value');
    const countdown = value  - Date.now();
    this.timer = (countdown / 1000);
  }

  @Input ()
  set reversed(isReversed) {
    if (isReversed === true) {
      this._reversed = isReversed;
      this.startGame();
    }
  }

  @Input()
  set allPairsFound(value) {
    if (value === true) {
      this.startGame();
    }
  }

  public pairs = [];


  constructor(private emoji: EmojiLookupService) {}

  ngOnInit() {
    this.listPairs();
    this.updateFoundPairs(this.foundPairsSet);
    console.log(this.socketData);
  }

  // we need an array of pair objects

  public listPairs() {
    this.userPairs.forEach( (pairset) => {
      const primaryId = pairset.primary[0];
      const secondaryId = pairset.secondary[0];
      const namedPairSet = []
      this.participants.forEach( (participant) => {
        if (participant.id === primaryId || participant.id === secondaryId) {
          namedPairSet.push({name: participant.first_name, isReady: false});
        }
      });
      this.pairs.push({
        pair: namedPairSet,
        isPairReady: false
      });
    });
  }

  public startGame() {
    if (this._reversed) {
      this.primaryEmoji = this.emoji.getEmoji(this.data.message.activity_status.primary_role.role_emoji);
      this.secondaryEmoji = this.emoji.getEmoji(this.data.message.activity_status.secondary_role.role_emoji);
    } else {
      this.primaryEmoji = this.emoji.getEmoji(this.data.message.activity_status.primary_role.role_emoji);
      this.secondaryEmoji = this.emoji.getEmoji(this.data.message.activity_status.secondary_role.role_emoji);

    }
    this.sfxPlyaer.nativeElement.pause();
    this.pairGameStarted = true;
    const countdown = Date.parse(this.data.message.activity_status.countdown_discussion) - Date.now();
    this.totalSeconds = (countdown / 1000);
    this.initialTimeRemaining = (countdown / 1000);
    this.secondsElapsed = 0;
    console.log(`${this.totalSeconds} left until switch`);
    this.secondsElapsedInterval = interval(100);

    this.intervalSubscription = this.secondsElapsedInterval.pipe(
      takeWhile((time: number) => time / 10 < this.initialTimeRemaining)
    );

    this.intervalSubscription.subscribe((time) => {
      this.secondsElapsed = time;
    });
  }

  private checktime() {
    if ((this.secondsElapsed) / 10 >= this.initialTimeRemaining) {
      console.log('unsubscribed');
      this.intervalSubscription.unsubscribe();
    }
  }

  private updateFoundPairs(foundPairsArray) {
    //check the array of found pairs [2,3,4,5]]
    //for each id in the arary
    if(foundPairsArray) {
      foundPairsArray.forEach((id) => {
        //check the participants list
        const currentParticipant = this.participants.find( (participant) => {
          return participant.id === id;
        });
        console.log(`${currentParticipant.first_name} is ready`);
        this.pairs.forEach( (pair) => {
          //for each pair object, look at the pair
          const currentMember = pair.pair.find( (participant) => {
            return participant.name === currentParticipant.first_name;
          });
          if (currentMember) {
            currentMember.isReady = true;
            this.validatePairs();
          }
        });
      });
    }
  }

  private validatePairs() {
    this.pairs.forEach( (pair) => {
      if (pair.pair[0].isReady && pair.pair[1].isReady) {
        pair.isPairReady = true;
      }
    });

  }


}

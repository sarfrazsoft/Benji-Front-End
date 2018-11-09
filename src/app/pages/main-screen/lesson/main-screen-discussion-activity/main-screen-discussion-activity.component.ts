import { Component, OnInit, Input } from "@angular/core";
import { interval, of } from "rxjs";
import { takeWhile, tap, share } from "rxjs/operators";
import { callbackify } from "util";

@Component({
  selector: "app-main-screen-discussion-activity",
  templateUrl: "./main-screen-discussion-activity.component.html",
  styleUrls: ["./main-screen-discussion-activity.component.scss"]
})
export class MainScreenDiscussionActivityComponent implements OnInit {
  public presenterOne: any;
  public presenterTwo: any;
  public nextUpOne: any;
  public nextUpTwo: any;
  public discussionInstruction;
  public discussionOver = false;
  public totalSeconds;
  public secondsElapsed;
  public isActivityOver;

  private sharingIntervalStarted;
  private discussionStarted;
  private secondsElapsedInterval;
  private intervalSubscription;
  private _socketData;
  private stopTimer;

  @Input()
  set socketData(data) {
    this._socketData = data;
    const activity = data.message.activity_status;
    this.discussionInstruction = activity.instructions;

    if (activity.next_activity_countdown && !this.isActivityOver) {
      this.isActivityOver = true;
    }

    if (!this.discussionOver) {
      this.setDiscussionTimer(activity);
    } else if (this.discussionOver && !this.isActivityOver) {
      if (!this.stopTimer) {
        this.stopTimer = true;
      }
      this.setSharingState(activity);
    }
  }

  constructor() {}

  ngOnInit() {}

  private setDiscussionTimer(activityData) {
    if (!this.discussionStarted) {
      const timerSetupPromise = of(
        this.setupTimer(
          activityData.discussion_countdown_time,
          this.endDiscussion
        )
      ).toPromise();
      timerSetupPromise.then(() => {
        setTimeout(() => {
          this.intervalSubscription.subscribe(time => {
            this.discussionStarted = true;
            this.secondsElapsed = time;
          });
        }, 100);
      });
    }
  }

  private endDiscussion(scope) {
    scope.discussionOver = true;
    scope.setSharingState(scope._socketData.message.activity_status);
  }

  private stopInterval(scope) {
    scope.stopTimer = true;
  }
  private setupTimer(timer, callback?) {
    this.secondsElapsed = 0;
    const _scope = this;
    const countdown = Date.parse(timer) - Date.now();
    this.totalSeconds = countdown / 1000;
    this.secondsElapsedInterval = interval(100);
    this.intervalSubscription = this.secondsElapsedInterval.pipe(
      tap((time: number) => {
        if (time / 10 >= this.totalSeconds) {
          callback(_scope);
        }
      }),
      takeWhile((time: number) => time / 10 < this.totalSeconds),
      takeWhile(() => !this.isActivityOver),
      takeWhile(() => !this.stopTimer)
    );
    return true;
  }

  private setSharingState(activityData) {
    const currentGroupIndex = activityData.sharer_group_num;
    const presentersIdObject = activityData.selected_sharers[currentGroupIndex];
    const nextUpIdObject = activityData.selected_sharers[currentGroupIndex + 1];
    this.preparePresenters(presentersIdObject, nextUpIdObject);
    this.setupTimer(
      activityData.sharer_countdown_time[currentGroupIndex],
      this.stopInterval
    );
    setTimeout(() => {
      this.stopTimer = false;
      this.intervalSubscription.subscribe(time => {
        this.secondsElapsed = time;
      });
    }, 100);
  }

  private preparePresenters(presenterIdObject, nextUpIdObject) {
    const _presenterOne = this._socketData.message.participants.find(
      participant => {
        return participant.id === presenterIdObject.primary[0];
      }
    );
    this.presenterOne = _presenterOne.first_name;

    const _presenterTwo = this._socketData.message.participants.find(
      participant => {
        return participant.id === presenterIdObject.secondary[0];
      }
    );
    this.presenterTwo = _presenterTwo.first_name;

    if (nextUpIdObject !== undefined) {
      const _nextUpOne = this._socketData.message.participants.find(
        participant => {
          return participant.id === nextUpIdObject.primary[0];
        }
      );
      this.nextUpOne = _nextUpOne.first_name;

      const _nextUpTwo = this._socketData.message.participants.find(
        participant => {
          return participant.id === nextUpIdObject.secondary[0];
        }
      );
      this.nextUpTwo = _nextUpTwo.first_name;
    } else if (nextUpIdObject === undefined) {
      this.nextUpOne = undefined;
      this.nextUpTwo = undefined;
    }
  }
}

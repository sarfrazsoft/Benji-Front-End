import { Component, OnInit, Input } from "@angular/core";
import { interval } from "rxjs";

@Component({
  selector: "app-main-screen-discussion-activity",
  templateUrl: "./main-screen-discussion-activity.component.html",
  styleUrls: ["./main-screen-discussion-activity.component.scss"]
})
export class MainScreenDiscussionActivityComponent implements OnInit {
  @Input()
  set socketData(data) {
    const activity = data.message.activity_status;
    this.discussionInstruction = activity.instructions;
    this.startGame(activity);
  }

  public discussionInstruction;
  public discussionTime;
  public discussionOver;
  public presenters;
  public nextUp;
  public discussionStarted;
  public totalSeconds;
  public initialTimeRemaining;
  public secondsElapsed = 0;
  public secondsElapsedInterval;

  constructor() {}

  ngOnInit() {}

  public startGame(activity) {
    const countdown =
      Date.parse(activity.discussion_countdown_time) - Date.now();
    if (!this.discussionOver){
      this.totalSeconds = countdown / 1000;
      this.initialTimeRemaining = countdown / 1000;
    } else {
      this.totalSeconds = 30;
      this.initialTimeRemaining = 30;
    }
    this.secondsElapsed = 0;
    console.log(`${this.totalSeconds} left until switch`);
    this.secondsElapsedInterval = interval(100).subscribe(() => {
      ++this.secondsElapsed;
      this.checktime();
    });
  }

  private checktime() {
    if (this.secondsElapsed / 10 >= this.initialTimeRemaining) {
      this.secondsElapsedInterval.unsubscribe();
      if (!this.discussionOver) {
        this.discussionOver = true;
      }
    }
  }
}

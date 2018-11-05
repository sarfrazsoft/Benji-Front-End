import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-participant-discussion-activity",
  templateUrl: "./participant-discussion-activity.component.html",
  styleUrls: ["./participant-discussion-activity.component.scss"]
})
export class ParticipantDiscussionActivityComponent implements OnInit {
  @Input()
  set socketData(data) {
    const activity = data.message.activity_status;

    // this.sharingStarted = activity.sharer_countdown_time.length === 0;
    const countdown = Date.parse(activity.discussion_countdown_time) - Date.now();
    this.discussionSecondsRemaining = countdown / 1000;

    setTimeout(() => {
      this.sharingStarted = true;
    }, this.discussionSecondsRemaining * 1000);

    if (this.sharingStarted) {
      const currentGroup = activity.selected_sharers[activity.sharer_group_num];
      this.iAmSharing =
        data.your_identity.id === currentGroup.primary ||
        data.your_identity.id === currentGroup.secondary;
    }
  }

  @Output()
  socketMessage = new EventEmitter<any>();

  public sharingStarted;
  public iAmSharing;
  public discussionSecondsRemaining;
  public instructions;

  constructor() {}

  ngOnInit() {}

  shareButton() {
    const message = { event: "share_button" };
    this.socketMessage.emit(message);
  }

  doneButton() {
    const message = { event: "done_button" };
    this.socketMessage.emit(message);
  }
}

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
    const countdown =
      Date.parse(activity.discussion_countdown_time) - Date.now();
    if (!this.discussionSecondsRemaining) {
      this.discussionSecondsRemaining = countdown / 1000;
    }

    setTimeout(() => {
      this.sharingStarted = true;
    }, this.discussionSecondsRemaining * 1000);

    if (this.sharingStarted) {
      const currentGroup = activity.selected_sharers[activity.sharer_group_num];
      console.log(`My ID: ${data.your_identity.id}`);
      console.log(`Current Groups Primary ID: ${currentGroup.primary}`);
      console.log(`Current Groups Secondary ID: ${currentGroup.secondary}`);
      if (
        data.your_identity.id === currentGroup.primary[0] ||
        data.your_identity.id === currentGroup.secondary[0]
      ) {
        this.iAmSharing = true;
        const sharingCountdown = Date.parse(activity.sharer_countdown_time) - Date.now();
        if (!this.sharingSecondsRemaining) {
          this.sharingSecondsRemaining = countdown / 1000;
        }
      } else {
        this.iAmSharing = false;
      }
      console.log(`Am I sharing?: ${this.iAmSharing}`);
    }
  }

  @Output()
  socketMessage = new EventEmitter<any>();

  public sharingStarted;
  public iAmSharing;
  public discussionSecondsRemaining;
  public sharingSecondsRemaining;
  public instructions;
  public isVolunteer: boolean;
  public isSharingDone: boolean;

  constructor() {}

  ngOnInit() {}

  shareButton() {
    if (!this.isVolunteer) {
      this.isVolunteer = true;
      const message = { event: "share_button" };
      this.socketMessage.emit(message);
    }
  }

  doneButton() {
    if (!this.isSharingDone) {
      const message = { event: "done_button" };
      this.socketMessage.emit(message);
      this.isSharingDone = true;
    }
  }
}

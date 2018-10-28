import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-participant-discussion-activity',
  templateUrl: './participant-discussion-activity.component.html',
  styleUrls: ['./participant-discussion-activity.component.scss']
})
export class ParticipantDiscussionActivityComponent implements OnInit {
  @Input()
  set socketData(data) {
    const activity = data.message.activity_status;

    this.sharingStarted = activity.sharer_countdown_time.length === 0;

    if (this.sharingStarted) {
      const currentGroup = activity.selected_sharers[activity.sharer_group_num];
      this.iAmSharing = data.message.your_identity.id === currentGroup.primary || data.message.your_identity.id === currentGroup.secondary;
    }
  }

  @Output()
  socketMessage = new EventEmitter<any>();

  public sharingStarted;
  public iAmSharing;


  constructor() { }

  ngOnInit() {
  }

  shareButton() {
    const message = {'event': 'share_button'};
    this.socketMessage.emit(message);
  }

  doneButton() {
    const message = {'event': 'done_button'};
    this.socketMessage.emit(message);
  }

}

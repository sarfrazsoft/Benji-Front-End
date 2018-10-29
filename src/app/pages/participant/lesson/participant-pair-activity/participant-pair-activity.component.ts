import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { EmojiLookupService } from '../../../../services/emoji-lookup.service';

@Component({
  selector: 'app-participant-pair-activity',
  templateUrl: './participant-pair-activity.component.html',
  styleUrls: ['./participant-pair-activity.component.scss']
})
export class ParticipantPairActivityComponent implements OnInit {

  @Input()
  set socketData(data) {
    const activity = data.message.activity_status;

    this.pairActivityStarted = activity.all_pairs_found;
    this.isReady = activity.user_pairs_found.indexOf(data.message.your_identity.id) > 0;

    for (let group of activity.user_groups) {
      if (group.primary.indexOf(data.message.your_identity.id) > 0) {
        this.roleEmoji = this.emoji.getEmoji('zipface'); // TODO WHAT IS THE EMOJI FOR THE SEPAKER?
      } else if (group.secondary.indexOf(data.message.your_identity.id) > 0) {
        this.roleEmoji = this.emoji.getEmoji('zipface');
      }
    }
  }

  @Output()
  socketMessage = new EventEmitter<any>();

  constructor(private emoji: EmojiLookupService) { }

  public isReady = false;
  public pairActivityStarted = true;
  public roleEmoji: string;

  ngOnInit() {
    this.roleEmoji = this.emoji.getEmoji('zipface');
  }


  public sendReadyState() {
    this.socketMessage.emit({'event': 'pair_found'});
  }
}

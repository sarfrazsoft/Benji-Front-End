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
    this.isReady = activity.user_pairs_found.indexOf(data.message.your_identity.id) > 0

    if (!this.timeSet) {
      this.timeRemaining = activity.activity_timer;
      this.timeSet = true;
    }

    let partnerID;

    for (const group of activity.user_groups) {
      if (group.primary.indexOf(data.message.your_identity.id) > 0) {
        this.roleEmoji = this.emoji.getEmoji('zipface'); // TODO WHAT IS THE EMOJI FOR THE SEPAKER?
        partnerID = group.secondary[0];
        this.roleName = activity.primary_role.role_name;
        this.roleInstructions = activity.primary_role.role_instructions;
      } else if (group.secondary.indexOf(data.message.your_identity.id) > 0) {
        this.roleEmoji = this.emoji.getEmoji('zipface');
        partnerID = group.primary[0];
        this.roleName = activity.secondary_role.role_name;
        this.roleInstructions = activity.secondary_role.role_instructions;
      }
    }

    for (const part of data.message.participants) {
      if (part.id === partnerID) {
        this.partnerName = part.first_name;
      }
    }


  }

  @Output()
  socketMessage = new EventEmitter<any>();

  constructor(private emoji: EmojiLookupService) { }

  public isReady = false;
  public pairActivityStarted = true;
  public roleEmoji: string;
  public partnerName = '';
  public roleName = '';
  public roleInstructions = '';
  public timeRemaining = 60;
  public timeSet = false;

  ngOnInit() {
    this.roleEmoji = this.emoji.getEmoji('zipface');
  }


  public sendReadyState() {
    this.socketMessage.emit({'event': 'pair_found'});
  }
}

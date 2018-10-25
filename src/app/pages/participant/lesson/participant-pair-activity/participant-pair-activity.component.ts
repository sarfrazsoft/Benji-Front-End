import { Component, OnInit } from '@angular/core';
import { EmojiLookupService } from '../../../../services/emoji-lookup.service';

@Component({
  selector: 'app-participant-pair-activity',
  templateUrl: './participant-pair-activity.component.html',
  styleUrls: ['./participant-pair-activity.component.scss']
})
export class ParticipantPairActivityComponent implements OnInit {

  constructor(private emoji: EmojiLookupService) { }

  public isReady = false;
  public pairActivityStarted = true;
  public roleEmoji: string;

  ngOnInit() {
    this.roleEmoji = this.emoji.getEmoji('zipface');
  }


  public sendReadyState() {
    this.isReady = true;
  }
}

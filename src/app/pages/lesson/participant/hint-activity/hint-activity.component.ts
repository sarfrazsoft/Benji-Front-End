import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import {
  HintWordsAndVotes,
  HintWordSubmitVoteEvent,
  HintWordSubmitWordEvent
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-hint-activity',
  templateUrl: './hint-activity.component.html',
  styleUrls: ['./hint-activity.component.scss']
})
export class ParticipantHintActivityComponent extends BaseActivityComponent {
  hintWord = new FormControl(null, Validators.required);
  selectedWord: HintWordsAndVotes;

  participantHasSubmitted() {
    return (
      this.activityState.hintwordactivity.submitted_users.find(
        u => u.id === this.activityState.your_identity.id
      ) !== undefined
    );
  }

  participantHasVoted() {
    return (
      this.activityState.hintwordactivity.voted_users.find(
        u => u.id === this.activityState.your_identity.id
      ) !== undefined
    );
  }

  public submitHintWord() {
    if (!this.participantHasSubmitted() && this.hintWord.value !== undefined) {
      this.sendMessage.emit(new HintWordSubmitWordEvent(this.hintWord.value));
    }
  }

  public submitVote() {
    if (!this.participantHasVoted() && this.selectedWord !== undefined) {
      this.sendMessage.emit(new HintWordSubmitVoteEvent(this.selectedWord.id));
    }
  }
}

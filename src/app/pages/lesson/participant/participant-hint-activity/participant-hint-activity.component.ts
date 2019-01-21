import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'app-participant-hint-activity',
  templateUrl: './participant-hint-activity.component.html',
  styleUrls: ['./participant-hint-activity.component.scss']
})
export class ParticipantHintActivityComponent extends BaseActivityComponent {
  hintWord = new FormControl(null, Validators.required);
  selectedWord: string;

  participantHasSubmitted() {
    return (
      this.activityState.activity_status.submitted_users.indexOf(
        this.activityState.your_identity.id
      ) > -1
    );
  }

  participantHasVoted() {
    return (
      this.activityState.activity_status.voted_users.indexOf(
        this.activityState.your_identity.id
      ) > -1
    );
  }

  public submitHintWord() {
    if (!this.participantHasSubmitted() && this.hintWord.value !== undefined) {
      this.sendMessage.emit({
        event: 'submit_word',
        word: this.hintWord.value
      });
    }
  }

  public submitVote() {
    if (!this.participantHasVoted() && this.selectedWord !== undefined) {
      this.sendMessage.emit({ event: 'submit_vote', word: this.selectedWord });
    }
  }
}

import { Component, OnChanges, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { ContextService } from 'src/app/services';
import {
  HintWordsAndVotes,
  HintWordSubmitVoteEvent,
  HintWordSubmitWordEvent,
  Timer,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-hint-activity',
  templateUrl: './hint-activity.component.html',
  styleUrls: ['./hint-activity.component.scss'],
})
export class ParticipantHintActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {
  act;
  hintWord = new FormControl(null, Validators.required);
  selectedWord: HintWordsAndVotes;

  constructor(private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges() {
    this.act = this.activityState.hintwordactivity;
    if (!this.act.submission_complete && !this.act.voting_complete) {
      const timer = this.act.submission_countdown_timer;
      this.contextService.activityTimer = timer;
    } else if (this.act.submission_complete && !this.act.voting_complete) {
      const timer = this.act.voting_countdown_timer;
      this.contextService.activityTimer = timer;
    } else if (this.act.submission_complete && this.act.voting_complete) {
      const timer = this.getNextActStartTimer();
      this.contextService.activityTimer = timer;
    }
  }

  participantHasSubmitted() {
    return (
      this.activityState.hintwordactivity.submitted_participants.find(
        (u) => u.participant_code === this.myParticipantCode
      ) !== undefined
    );
  }

  participantHasVoted() {
    return (
      this.activityState.hintwordactivity.voted_participants.find(
        (u) => u.participant_code === this.myParticipantCode
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

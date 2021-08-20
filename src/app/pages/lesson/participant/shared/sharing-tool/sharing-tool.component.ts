import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import {
  ParticipantOptInEvent,
  ParticipantOptOutEvent,
  SubmitSharingParticipantCommentEvent,
  SubmitSharingParticipantReactionEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { Participant } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-ps-sharing-tool',
  templateUrl: './sharing-tool.component.html',
})
export class ParticipantSharingToolComponent implements OnInit, OnChanges {
  optedIn = false;
  @Input() activityState: UpdateMessage;

  @Output() sendMessage = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}

  ngOnChanges() {}

  amISharing() {
    const volunteers = this.activityState.running_tools.share.volunteers;
    return volunteers.includes(this.getParticipantCode());
  }

  getParticipantCode(): number {
    let details: Participant;
    if (localStorage.getItem('participant')) {
      details = JSON.parse(localStorage.getItem('participant'));
      return details.participant_code;
    }
  }

  optIn() {
    this.sendMessage.emit(new ParticipantOptInEvent());
  }

  optOut() {
    this.sendMessage.emit(new ParticipantOptOutEvent());
  }

  handleReaction(reaction: string) {
    this.sendMessage.emit(new SubmitSharingParticipantReactionEvent(reaction));
  }

  handleComment(comment: string) {
    this.sendMessage.emit(new SubmitSharingParticipantCommentEvent(comment));
  }
  
}

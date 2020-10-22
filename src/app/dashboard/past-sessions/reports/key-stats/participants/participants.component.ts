import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { part } from 'core-js/fn/function';
import { ContextService } from 'src/app/services';
import { PastSessionsService } from 'src/app/services';
import { ParticipantCode } from 'src/app/services/backend/schema';
import { Participant } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
})
export class ParticipantsComponent implements OnInit, OnChanges {
  @Input() data: { participant_set: Array<Participant> } = { participant_set: [] };
  @Input() userIsAdmin = false;
  selected = [];
  participants = [];
  dialogRef;
  constructor(private pastSessionService: PastSessionsService, private contextService: ContextService) {}

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe((list) => {
      this.selected = list;
    });
  }

  isSelected(participant: Participant) {
    return this.selected.find((x) => x === participant.participant_code);
  }

  ngOnChanges() {
    if (this.data) {
      this.participants = this.data.participant_set;
    }
  }

  participantClicked(event, participant: Participant) {
    this.pastSessionService.addToFilteredInList(participant.participant_code);
  }

  showOnly(participant: Participant) {
    this.pastSessionService.removeAllBut(participant.participant_code);
  }
}

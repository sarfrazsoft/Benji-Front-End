import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PastSessionsService } from '../../../services/past-sessions.service';

@Component({
  selector: 'benji-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit, OnChanges {
  @Input() data: any = { joined_users: [] };
  selected = [];
  participants = [];
  constructor(private pastSessionService: PastSessionsService) {}

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe(list => {
      this.selected = list;
    });
  }

  isSelected(participant) {
    return this.selected.find(x => x === participant.id);
  }

  ngOnChanges() {
    if (this.data) {
      this.participants = this.data.joined_users;
    }
  }

  participantClicked(event, participant) {
    this.pastSessionService.addToFilteredInList(participant.id);
  }
}

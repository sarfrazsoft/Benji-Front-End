import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ContextService } from 'src/app/services';
import { PastSessionsService } from 'src/app/services/past-sessions.service';

@Component({
  selector: 'benji-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit, OnChanges {
  @Input() data: any = { joined_users: [] };
  allowAllSelection;
  selected = [];
  participants = [];
  dialogRef;
  constructor(
    private pastSessionService: PastSessionsService,
    private contextService: ContextService
  ) {}

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe(list => {
      this.selected = list;
    });
    this.contextService.user$.subscribe(user => {
      if (user.local_admin_permission) {
        this.allowAllSelection = true;
      }
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

  showOnly(participant) {
    this.pastSessionService.removeAllBut(participant.id);
  }
}

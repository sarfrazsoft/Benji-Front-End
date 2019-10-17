import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'benji-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit, OnChanges {
  @Input() data: any = { joined_users: [] };
  selected = [];
  participants = [];
  constructor() {}

  ngOnInit() {}

  isSelected(participant) {
    return this.selected.find(x => x === participant.id);
  }

  ngOnChanges() {
    if (this.data) {
      this.participants = this.data.joined_users;
    }
  }

  participantClicked(participant) {
    if (this.isSelected(participant)) {
      this.selected = this.selected.filter(x => x !== participant.id);
    } else {
      this.selected.push(participant.id);
    }
    console.log(this.selected);
  }
}

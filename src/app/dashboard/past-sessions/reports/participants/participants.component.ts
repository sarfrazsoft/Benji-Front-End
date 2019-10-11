import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'benji-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {
  @Input() data: any;
  selected = [];
  constructor() {}

  ngOnInit() {}

  isSelected(participant) {
    return this.selected.find(x => x === participant.id);
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

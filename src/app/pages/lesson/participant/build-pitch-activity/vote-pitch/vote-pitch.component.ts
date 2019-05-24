import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'benji-vote-pitch',
  templateUrl: './vote-pitch.component.html',
  styleUrls: ['./vote-pitch.component.scss']
})
export class VotePitchComponent implements OnInit {
  @Input() user = null;
  @Input() selectedUser = null;
  @Input() pitchText = '';
  @Input() name = '';
  @Output() userSelected = new EventEmitter();
  expanded = false;
  constructor() {}

  ngOnInit() {}

  selectUser(user) {
    this.userSelected.emit(user);
  }
}

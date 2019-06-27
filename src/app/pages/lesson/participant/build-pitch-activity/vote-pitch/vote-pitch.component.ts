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
  @Input() expanded = false;
  @Output() userSelected = new EventEmitter();
  @Output() userExpanded = new EventEmitter();
  @Output() userCollapsed = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  selectUser(user) {
    this.userSelected.emit(user);
  }

  expand(user) {
    this.expanded = true;
    this.userExpanded.emit(user);
  }

  collapse(user) {
    this.expanded = false;
    this.userCollapsed.emit(user);
  }
}

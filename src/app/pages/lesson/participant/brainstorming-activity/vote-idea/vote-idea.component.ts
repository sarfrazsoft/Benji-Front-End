import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'benji-vote-idea',
  templateUrl: './vote-idea.component.html',
  styleUrls: ['./vote-idea.component.scss']
})
export class VoteIdeaComponent implements OnInit {
  @Input() user = null;
  @Input() selectedIdea = null;
  @Input() ideaText = '';
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

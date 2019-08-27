import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'benji-vote-idea',
  templateUrl: './vote-idea.component.html',
  styleUrls: ['./vote-idea.component.scss']
})
export class VoteIdeaComponent implements OnInit {
  @Input() ideaId = null;
  @Input() selectedIdeas = [];
  @Input() ideaText = '';
  @Input() name = '';
  @Input() expanded = false;
  @Output() ideaSelected = new EventEmitter();
  @Output() ideaExpanded = new EventEmitter();
  @Output() ideaCollapsed = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  selectIdea(idea) {
    this.ideaSelected.emit(idea);
  }

  expand(idea) {
    this.expanded = true;
    this.ideaExpanded.emit(idea);
  }

  collapse(idea) {
    this.expanded = false;
    this.ideaCollapsed.emit(idea);
  }
}

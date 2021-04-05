import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'benji-vote-idea',
  templateUrl: './vote-idea.component.html',
})
export class VoteIdeaComponent implements OnInit {
  @Input() ideaId = null;
  @Input() selectedIdeas = [];
  @Input() ideaText = '';
  @Input() name = '';
  @Output() ideaSelected = new EventEmitter();
  @Output() ideaExpanded = new EventEmitter();
  @Output() ideaCollapsed = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  selectIdea(idea) {
    this.ideaSelected.emit(idea);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'benji-vote-idea',
  templateUrl: './vote-idea.component.html',
})
export class VoteIdeaComponent implements OnInit {
  @Input() ideaId = null;
  @Input() selectedIdeas = [];
  @Input() ideaText = '';
  @Input() ideaImage = null;
  @Input() name = '';
  @Output() ideaSelected = new EventEmitter();

  hostname ="";
  //If host value set, Giphy images do not display because they have another host
  //hostname = window.location.protocol + '//' + window.location.hostname; 
  constructor() {}

  ngOnInit() {}

  selectIdea(idea) {
    this.ideaSelected.emit(idea);
  }
}

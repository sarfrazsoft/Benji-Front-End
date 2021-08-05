import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

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

  hostname = environment.web_protocol + '://' + environment.host;
  constructor() {}

  ngOnInit() {}

  selectIdea(idea) {
    this.ideaSelected.emit(idea);
  }
}

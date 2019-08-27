import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-brainstorming-activity',
  templateUrl: './brainstorming-activity.component.html',
  styleUrls: ['./brainstorming-activity.component.scss']
})
export class ParticipantBrainstormingActivityComponent
  extends BaseActivityComponent
  implements OnInit {
  submitIdeas = false;
  submitVote = true;
  selectedIdea;
  selectedIdeas = [];
  expandedUserArray = {};
  ideas = [
    {
      id: 1,
      text: 'brrr brr br brrrr more brrrrr horrendous brrrrr'
    },
    {
      id: 2,
      text: 'second brrr brr br brrrr more brrrrr horrendous brrrrr'
    },
    {
      id: 3,
      text: 'third brrr brr br brrrr more brrrrr horrendous brrrrr'
    },
    {
      id: 4,
      text: 'brrr brr br brrrr more brrrrr horrendous brrrrr'
    },
    {
      id: 5,
      text: 'second brrr brr br brrrr more brrrrr horrendous brrrrr'
    },
    {
      id: 6,
      text: 'third brrr brr br brrrr more brrrrr horrendous brrrrr'
    }
  ];
  constructor() {
    super();
  }

  ngOnInit() {}

  ideaSelected($event) {
    if (this.selectedIdeas.includes($event)) {
      const index = this.selectedIdeas.indexOf($event);
      if (index !== -1) {
        this.selectedIdeas.splice(index, 1);
      }
    } else {
      this.selectedIdeas.unshift($event);
    }
    if (this.selectedIdeas.length > 3) {
      this.selectedIdeas = this.selectedIdeas.slice(0, 3);
    }
    console.log(this.selectedIdeas);
  }

  userExpanded($event) {
    // console.log($event);
    this.expandedUserArray['' + $event] = true;
  }

  userCollapsed($event) {
    this.expandedUserArray['' + $event] = false;
  }
}

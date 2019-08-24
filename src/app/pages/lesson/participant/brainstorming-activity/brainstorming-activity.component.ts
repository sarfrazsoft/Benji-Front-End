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
  selectedUser;
  expandedUserArray = {};
  ideas = [
    {
      id: 1,
      text: 'brrr brr br brrrr more brrrrr horrendous brrrrr'
    }
  ];
  constructor() {
    super();
  }

  ngOnInit() {}

  userSelected($event) {
    this.selectedUser = $event;
  }

  userExpanded($event) {
    // console.log($event);
    this.expandedUserArray['' + $event] = true;
  }

  userCollapsed($event) {
    this.expandedUserArray['' + $event] = false;
  }
}

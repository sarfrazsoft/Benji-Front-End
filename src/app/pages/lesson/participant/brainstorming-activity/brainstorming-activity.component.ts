import { Component, OnChanges, OnInit } from '@angular/core';
import {
  BrainstormActivity,
  BrainstormSubmitEvent,
  BrainstormVoteEvent
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-brainstorming-activity',
  templateUrl: './brainstorming-activity.component.html',
  styleUrls: ['./brainstorming-activity.component.scss']
})
export class ParticipantBrainstormingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  submitIdeas = true;
  submitVote = false;
  userIdeaText = '';
  selectedIdea;
  bsAct: BrainstormActivity;
  selectedIdeas = [];
  noOfIdeasSumitted = 0;
  showThankyouForSubmission = false;
  expandedUserArray = {};
  ideas = [];
  showVoteSubmitButton = false;
  showLookAtScreen = false;

  constructor() {
    super();
  }

  ngOnInit() {
    this.bsAct = this.activityState.brainstormactivity;
  }

  ngOnChanges() {
    this.bsAct = this.activityState.brainstormactivity;
    console.log(this.activityState.brainstormactivity);

    const uid = this.getUserId();
    const obj = this.bsAct.user_submission_counts.find(v => v.id === uid);
    if (obj) {
      this.noOfIdeasSumitted = obj.count;
    }
    if (this.noOfIdeasSumitted >= this.bsAct.max_user_submissions) {
      this.showThankyouForSubmission = true;
    }

    if (this.bsAct.submission_complete && this.bsAct.voting_countdown_timer) {
      this.showThankyouForSubmission = false;
      this.submitIdeas = false;
      this.submitVote = true;
      this.ideas = [];
      this.bsAct.idea_rankings.forEach(idea => {
        this.ideas.push(idea);
      });
    }

    if (this.bsAct.submission_complete && this.bsAct.voting_complete) {
      this.showThankyouForSubmission = false;
      this.showLookAtScreen = true;
    }
  }

  ideaSelected($event) {
    if (this.selectedIdeas.includes($event)) {
      const index = this.selectedIdeas.indexOf($event);
      if (index !== -1) {
        this.selectedIdeas.splice(index, 1);
      }
    } else {
      this.selectedIdeas.unshift($event);
    }
    if (
      this.selectedIdeas.length >
      this.activityState.brainstormactivity.max_user_votes
    ) {
      this.selectedIdeas = this.selectedIdeas.slice(
        0,
        this.activityState.brainstormactivity.max_user_votes
      );
    }
    console.log(this.selectedIdeas);
    if (this.selectedIdeas.length) {
      this.showVoteSubmitButton = true;
    } else {
      this.showVoteSubmitButton = false;
    }
  }

  userExpanded($event) {
    // console.log($event);
    this.expandedUserArray['' + $event] = true;
  }

  userCollapsed($event) {
    this.expandedUserArray['' + $event] = false;
  }

  submitIdea(text: string) {
    console.log(text);
    this.sendMessage.emit(new BrainstormSubmitEvent(text));
    this.userIdeaText = '';
  }

  getUserId() {
    return this.activityState.your_identity.id;
  }

  submitIdeaVote() {
    console.log(this.selectedIdeas);
    this.selectedIdeas.forEach(idea => {
      this.sendMessage.emit(new BrainstormVoteEvent(idea));
    });
    // this.selectedIdeas
  }
}

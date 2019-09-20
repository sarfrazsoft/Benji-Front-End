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
  bsAct: BrainstormActivity;
  userIdeaText = '';
  selectedIdeas = [];
  ideas = [];
  showVoteSubmitButton = false;

  // Screens
  showSubmitIdeas = true;
  showThankyouForSubmission = false;
  showSubmitVote = false;
  showThankyouForVoting = false;
  showVoteResults = false;

  constructor() {
    super();
  }

  ngOnInit() {
    this.bsAct = this.activityState.brainstormactivity;
  }

  ngOnChanges() {
    this.bsAct = this.activityState.brainstormactivity;
    const userID = this.getUserId();

    // The activity starts by showing Submit idea screen

    // Show thank you for idea submission
    const userVote = this.bsAct.user_submission_counts.find(
      v => v.id === userID
    );
    if (userVote && userVote.count >= this.bsAct.max_user_submissions) {
      this.showSubmitIdeas = false;
      this.showThankyouForSubmission = true;
    }

    // Show Vote for ideas screen
    if (this.bsAct.submission_complete && this.bsAct.voting_countdown_timer) {
      this.showSubmitIdeas = false;
      this.showThankyouForSubmission = false;
      this.showSubmitVote = true;
      this.ideas = [];
      this.bsAct.idea_rankings.forEach(idea => {
        this.ideas.push(idea);
      });
    }

    // Show thank you for vote submission
    const userVotes = this.bsAct.user_vote_counts.find(v => v.id === userID);
    if (userVotes && userVotes.count >= this.bsAct.max_user_votes) {
      this.showSubmitIdeas = false;
      this.showThankyouForSubmission = false;
      this.showSubmitVote = false;
      this.showThankyouForVoting = true;
    }

    // Show the winning ideas screen
    if (this.bsAct.submission_complete && this.bsAct.voting_complete) {
      this.showSubmitIdeas = false;
      this.showThankyouForSubmission = false;
      this.showSubmitVote = false;
      this.showThankyouForVoting = false;
      this.showVoteResults = true;
    }
  }

  ideaSelected($event): void {
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
    if (this.selectedIdeas.length) {
      this.showVoteSubmitButton = true;
    } else {
      this.showVoteSubmitButton = false;
    }
  }

  submitIdea(): void {
    this.sendMessage.emit(new BrainstormSubmitEvent(this.userIdeaText));
    this.userIdeaText = '';
  }

  getUserId(): number {
    return this.activityState.your_identity.id;
  }

  submitIdeaVote(): void {
    this.selectedIdeas.forEach(idea => {
      this.sendMessage.emit(new BrainstormVoteEvent(idea));
    });
  }
}

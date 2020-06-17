import { Component, OnChanges, OnInit } from '@angular/core';
import {
  BrainstormActivity,
  BrainstormSubmitEvent,
  BrainstormVoteEvent,
} from 'src/app/services/backend/schema';
import { ContextService } from 'src/app/services/context.service';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-brainstorming-activity',
  templateUrl: './brainstorming-activity.component.html',
  styleUrls: ['./brainstorming-activity.component.scss'],
})
export class ParticipantBrainstormingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  act: BrainstormActivity;
  userIdeaText = '';
  selectedIdeas = [];
  ideas = [];
  showVoteSubmitButton = false;
  noOfIdeasSubmitted = 0;

  // Screens
  showSubmitIdeas = true;
  showThankyouForSubmission = false;
  showSubmitVote = false;
  showThankyouForVoting = false;
  showVoteResults = false;

  constructor(private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    this.act = this.activityState.brainstormactivity;
  }

  ngOnChanges() {
    this.act = this.activityState.brainstormactivity;
    const userID = this.getUserId();

    // The activity starts by showing Submit idea screen

    if (!this.act.submission_complete && this.act.submission_countdown_timer) {
      this.showSubmitIdeas = true;
      this.showThankyouForSubmission = false;
      this.showSubmitVote = false;
      this.contextService.activityTimer = this.act.submission_countdown_timer;
    }
    // Show thank you for idea submission
    const submissionCount = this.act.user_submission_counts.find(
      (v) => v.id === userID
    );
    if (submissionCount) {
      this.noOfIdeasSubmitted = submissionCount.count;
      if (submissionCount.count >= this.act.max_user_submissions) {
        this.showSubmitIdeas = false;
        this.showThankyouForSubmission = true;
      }
    } else {
      this.noOfIdeasSubmitted = 0;
    }

    // Show Vote for ideas screen
    if (this.act.submission_complete && this.act.voting_countdown_timer) {
      this.showSubmitIdeas = false;
      this.showThankyouForSubmission = false;
      this.showSubmitVote = true;
      this.ideas = [];
      this.act.idea_rankings.forEach((idea) => {
        this.ideas.push(idea);
      });

      this.ideas.sort((a, b) => b.id - a.id);
      this.contextService.activityTimer = this.act.voting_countdown_timer;
    }

    // Show thank you for vote submission
    const userVotes = this.act.user_vote_counts.find((v) => v.id === userID);
    if (userVotes && userVotes.count >= this.act.max_user_votes) {
      this.showSubmitIdeas = false;
      this.showThankyouForSubmission = false;
      this.showSubmitVote = false;
      this.showThankyouForVoting = true;
    }

    // Show the winning ideas screen
    if (this.act.submission_complete && this.act.voting_complete) {
      this.showSubmitIdeas = false;
      this.showThankyouForSubmission = false;
      this.showSubmitVote = false;
      this.showThankyouForVoting = false;
      this.showVoteResults = true;
      const timer = this.activityState.base_activity.next_activity_start_timer;
      this.contextService.activityTimer = timer;
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
    this.selectedIdeas.forEach((idea) => {
      this.sendMessage.emit(new BrainstormVoteEvent(idea));
    });
  }
}

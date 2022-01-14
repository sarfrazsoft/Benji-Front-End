import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import * as global from 'src/app/globals';
import { BrainstormService } from 'src/app/services';
import {
  BrainstormActivity,
  BrainstormSubmitEvent,
  BrainstormVoteEvent,
  Category,
  Idea,
} from 'src/app/services/backend/schema';
import { Participant } from 'src/app/services/backend/schema/course_details';
import { ContextService } from 'src/app/services/context.service';
import { UtilsService } from 'src/app/services/utils.service';
import { BaseActivityComponent } from '../../shared/base-activity.component';

export interface DraftIdea {
  id: number;
  text: string;
  editing: boolean;
  ideaImage?: string;
}

@Component({
  selector: 'benji-ps-brainstorming-activity',
  templateUrl: './brainstorming-activity.component.html',
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
  maxSubmissions = 1;
  participantCode;

  categories = [];
  // holds ideas in drafting phase
  draftIdeas: Array<DraftIdea> = [];
  // Screens
  showSubmitIdeas = true;
  showThankyouForSubmission = false;
  showSubmitVote = false;
  showThankyouForVoting = false;
  showVoteResults = false;

  // timer;

  constructor(
    private contextService: ContextService,
    private brainstormService: BrainstormService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private utilsService: UtilsService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    // this.act = this.activityState.brainstormactivity;
    // this.categories = this.act.brainstormcategory_set;
    // this.maxSubmissions = this.act.max_participant_submissions;
    // if (!this.actEditor) {
    //   this.participantCode = this.getParticipantCode().toString();
    // }

    // // The activity starts by showing Submit idea screen
    // if (!this.act.submission_complete && this.act.submission_countdown_timer) {
    //   localStorage.setItem('resetConnection', 'false');
    //   this.showSubmitIdeas = true;
    //   this.showThankyouForSubmission = false;
    //   this.showSubmitVote = false;
    //   this.showVoteResults = false;
    //   this.showThankyouForVoting = false;
    //   const submittedIdeas = this.brainstormService.getUserIdeas(this.getParticipantCode(), this.act);
    //   this.draftIdeas = [];
    //   submittedIdeas.forEach((idea: Idea) => {
    //     this.draftIdeas.push({
    //       id: idea.id,
    //       text: idea.idea,
    //       editing: false,
    //       ideaImage: idea.idea_image ? idea.idea_image.img : null,
    //     });
    //   });
    //   if (this.draftIdeas.length === 0) {
    //     this.addDraftIdea();
    //   }
    // }
  }

  addDraftIdea() {
    if (this.draftIdeas.length < this.maxSubmissions) {
      this.draftIdeas.push({ id: null, text: null, editing: true });
    }
  }

  ngOnChanges() {
    this.act = this.activityState.brainstormactivity;
    const userID = this.getParticipantCode();

    this.timer = this.getTimerTool();

    // Show thank you for idea submission

    // const submissionCount = this.brainstormService.getUserIdeas(userID, this.act);
    // if (submissionCount.length) {
    //   this.noOfIdeasSubmitted = submissionCount.length;
    //   if (submissionCount.length >= this.act.max_participant_submissions) {
    //     this.showSubmitIdeas = false;
    //     this.showThankyouForSubmission = true;
    //   }
    // } else {
    //   this.noOfIdeasSubmitted = 0;
    // }

    // Show Vote for ideas screen
    // if (this.act.submission_complete && this.act.voting_countdown_timer) {
    //   localStorage.removeItem('resetConnection');
    //   this.showSubmitIdeas = false;
    //   this.showThankyouForSubmission = false;
    //   this.showSubmitVote = true;
    //   this.showVoteResults = false;
    //   this.showThankyouForVoting = false;
    //   this.ideas = [];
    //   // this.act.brainstormcategory_set.forEach((category) => {
    //   //   if (!category.removed) {
    //   //     category.brainstormidea_set.forEach((idea) => {
    //   //       if (!idea.removed) {
    //   //         this.ideas.push(idea);
    //   //       }
    //   //     });
    //   //   }
    //   // });

    //   this.ideas.sort((a, b) => b.id - a.id);
    // }

    // Show thank you for vote submission
    // const userVotes = this.act.participant_vote_counts.find((v) => v.participant_code === userID);
    // if (userVotes && userVotes.count >= this.act.max_participant_votes) {
    //   this.showSubmitIdeas = false;
    //   this.showThankyouForSubmission = false;
    //   this.showSubmitVote = false;
    //   this.showThankyouForVoting = true;
    //   this.showVoteResults = false;
    // }

    // Show the winning ideas screen
    // if (this.act.submission_complete && this.act.voting_complete) {
    //   this.showSubmitIdeas = false;
    //   this.showThankyouForSubmission = false;
    //   this.showSubmitVote = false;
    //   this.showThankyouForVoting = false;
    //   this.showVoteResults = true;
    //   const timer = this.getNextActStartTimer();
    // }
  }

  ideaSelected($event): void {
    // if (this.selectedIdeas.includes($event)) {
    //   const index = this.selectedIdeas.indexOf($event);
    //   if (index !== -1) {
    //     this.selectedIdeas.splice(index, 1);
    //   }
    // } else {
    //   this.selectedIdeas.unshift($event);
    // }
    // if (this.selectedIdeas.length > this.activityState.brainstormactivity.max_participant_votes) {
    //   this.selectedIdeas = this.selectedIdeas.slice(
    //     0,
    //     this.activityState.brainstormactivity.max_participant_votes
    //   );
    // }
    // if (this.selectedIdeas.length) {
    //   this.showVoteSubmitButton = true;
    // } else {
    //   this.showVoteSubmitButton = false;
    // }
  }

  submitIdeaVote(): void {
    this.selectedIdeas.forEach((idea) => {
      this.sendMessage.emit(new BrainstormVoteEvent(idea));
    });
  }

  getVotesLeft() {
    // const pc = this.getParticipantCode();
    // const userVotes = this.act.participant_vote_counts.find((f) => f.participant_code === pc);
    // const maxVotes = this.act.max_participant_votes;
    // let subtract = 0;
    // if (userVotes) {
    //   subtract = userVotes.count;
    // }
    // const v = maxVotes - subtract;
    // return v;
  }
}

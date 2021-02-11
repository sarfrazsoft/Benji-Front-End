import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import * as global from 'src/app/globals';
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

  showCategoriesDropdown = false;
  categories = [];
  selectedCategory: Category;
  // Screens
  showSubmitIdeas = true;
  showThankyouForSubmission = false;
  showSubmitVote = false;
  showThankyouForVoting = false;
  showVoteResults = false;

  imagesList: FileList;

  constructor(
    private contextService: ContextService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private utilsService: UtilsService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.act = this.activityState.brainstormactivity;
    this.selectedCategory = this.act.brainstormcategory_set[0];
    this.categories = this.act.brainstormcategory_set;
  }

  ngOnChanges() {
    this.act = this.activityState.brainstormactivity;
    const userID = this.getParticipantCode();

    // show dropdown if categorize_flag is set
    if (this.act.categorize_flag) {
      this.showCategoriesDropdown = true;
      this.categories = this.act.brainstormcategory_set;
    } else {
      this.showCategoriesDropdown = false;
    }

    // The activity starts by showing Submit idea screen
    if (!this.act.submission_complete && this.act.submission_countdown_timer) {
      localStorage.setItem('resetConnection', 'false');
      this.showSubmitIdeas = true;
      this.showThankyouForSubmission = false;
      this.showSubmitVote = false;
      this.showVoteResults = false;
      this.showThankyouForVoting = false;
      this.contextService.activityTimer = this.act.submission_countdown_timer;
    }
    // Show thank you for idea submission

    const submissionCount = this.getUserIdeas(userID);
    if (submissionCount.length) {
      this.noOfIdeasSubmitted = submissionCount.length;
      if (submissionCount.length >= this.act.max_participant_submissions) {
        this.showSubmitIdeas = false;
        this.showThankyouForSubmission = true;
      }
    } else {
      this.noOfIdeasSubmitted = 0;
    }

    // Show Vote for ideas screen
    if (this.act.submission_complete && this.act.voting_countdown_timer) {
      localStorage.removeItem('resetConnection');
      this.showSubmitIdeas = false;
      this.showThankyouForSubmission = false;
      this.showSubmitVote = true;
      this.showVoteResults = false;
      this.showThankyouForVoting = false;
      this.ideas = [];
      this.act.brainstormcategory_set.forEach((category) => {
        if (!category.removed) {
          category.brainstormidea_set.forEach((idea) => {
            if (!idea.removed) {
              this.ideas.push(idea);
            }
          });
        }
      });

      this.ideas.sort((a, b) => b.id - a.id);
      this.contextService.activityTimer = this.act.voting_countdown_timer;
    }

    // Show thank you for vote submission
    const userVotes = this.act.participant_vote_counts.find((v) => v.participant_code === userID);
    if (userVotes && userVotes.count >= this.act.max_participant_votes) {
      this.showSubmitIdeas = false;
      this.showThankyouForSubmission = false;
      this.showSubmitVote = false;
      this.showThankyouForVoting = true;
      this.showVoteResults = false;
    }

    // Show the winning ideas screen
    if (this.act.submission_complete && this.act.voting_complete) {
      this.showSubmitIdeas = false;
      this.showThankyouForSubmission = false;
      this.showSubmitVote = false;
      this.showThankyouForVoting = false;
      this.showVoteResults = true;
      const timer = this.getNextActStartTimer();
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
    if (this.selectedIdeas.length > this.activityState.brainstormactivity.max_participant_votes) {
      this.selectedIdeas = this.selectedIdeas.slice(
        0,
        this.activityState.brainstormactivity.max_participant_votes
      );
    }
    if (this.selectedIdeas.length) {
      this.showVoteSubmitButton = true;
    } else {
      this.showVoteSubmitButton = false;
    }
  }

  submitIdea(): void {
    if (this.imagesList) {
      this.submitWithImg();
    } else {
      this.submitWithoutImg();
    }
  }

  submitWithoutImg() {
    if (this.userIdeaText.length === 0) {
      return;
    }
    this.sendMessage.emit(new BrainstormSubmitEvent(this.userIdeaText, this.selectedCategory.id));
    this.userIdeaText = '';
  }

  submitWithImg() {
    this.submitImageNIdea();
  }

  submitIdeaVote(): void {
    this.selectedIdeas.forEach((idea) => {
      this.sendMessage.emit(new BrainstormVoteEvent(idea));
    });
  }

  onFileSelect(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length === 0) {
      this.imagesList = null;
    } else {
      this.imagesList = fileList;
    }
  }

  submitImageNIdea() {
    const code = this.activityState.lesson_run.lessonrun_code;
    const url = global.apiRoot + '/course_details/lesson_run/' + code + '/upload_image/';
    const participant_code = this.getParticipantCode().toString();
    const fileList: FileList = this.imagesList;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.utilsService
        .resizeImage({
          file: file,
          maxSize: 500,
        })
        .then((resizedImage: Blob) => {
          const formData: FormData = new FormData();
          formData.append('img', resizedImage, file.name);
          formData.append('participant_code', participant_code);
          const headers = new HttpHeaders();
          headers.set('Content-Type', null);
          headers.set('Accept', 'multipart/form-data');
          const params = new HttpParams();
          this.httpClient
            .post(url, formData, { params, headers })
            .map((res: any) => {
              this.imagesList = null;
              this.sendMessage.emit(
                new BrainstormSubmitEvent(this.userIdeaText, this.selectedCategory.id, res.id)
              );
              this.userIdeaText = '';
            })
            .subscribe(
              (data) => {},
              (error) => console.log(error)
            );
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  }

  getUserIdeas(userID: number): Array<Idea> {
    const arr: Array<Idea> = [];
    this.act.brainstormcategory_set.forEach((category) => {
      if (!category.removed) {
        category.brainstormidea_set.forEach((idea) => {
          if (!idea.removed) {
            if (idea.submitting_participant && idea.submitting_participant.participant_code === userID) {
              arr.push(idea);
            }
          }
        });
      }
    });
    return arr;
  }
}

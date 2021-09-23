import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { uniqBy } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { BrainStormComponent } from 'src/app/dashboard/past-sessions/reports';
import { ActivitySettingsService, ContextService } from 'src/app/services';
import {
  BrainstormActivity,
  BrainstormCreateCategoryEvent,
  BrainstormRemoveCategoryEvent,
  BrainstormRemoveSubmissionEvent,
  BrainstormRenameCategoryEvent,
  BrainstormSetCategoryEvent,
  BrainstormSubmissionCompleteInternalEvent,
  BrainstormSubmitEvent,
  BrainstormToggleCategoryModeEvent,
  Idea,
  Timer,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

import { MatDialog } from '@angular/material/dialog';
import { ImageViewDialogComponent } from 'src/app/pages/lesson/shared/dialogs/image-view/image-view.dialog';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';
import { UncategorizedComponent } from './uncategorized/uncategorized.component';

@Component({
  selector: 'benji-ms-brainstorming-activity',
  templateUrl: './brainstorming-activity.component.html',
  styleUrls: ['./brainstorming-activity.component.scss'],
})
export class MainScreenBrainstormingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() peakBackState = false;
  @Input() editor = false;
  @Input() activityStage: Observable<string>;
  peakBackStage = null;
  private eventsSubscription: Subscription;

  constructor(
    private contextService: ContextService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private activitySettingsService: ActivitySettingsService
  ) {
    super();
  }
  instructions = '';
  timer: Timer;
  act: BrainstormActivity;

  submissionScreen = false;
  voteScreen = false;
  VnSComplete = false;
  categorizeFlag = false;
  showUserName = true;
  minWidth = 'medium';
  colDeleted = 0;
  joinedUsers = [];
  answeredParticipants = [];
  unansweredParticipants = [];
  ideaSubmittedUsersCount = 0;
  voteSubmittedUsersCount = 0;
  dialogRef;
  shownSubmissionCompleteNofitication = false;

  imagesURLs = [
    'localhost/media/Capture_LGXPk9s.JPG',
    'localhost/media/Capture_LGXPk9s.JPG',
    '../../../../../assets//img/Desk_lightblue2.jpg',
  ];

  settingsSubscription;
  ngOnInit() {
    super.ngOnInit();
    this.act = this.activityState.brainstormactivity;
    if (this.peakBackState) {
      this.eventsSubscription = this.activityStage.subscribe((state) => this.changeStage(state));
    }
    this.onChanges();

    this.settingsSubscription = this.activitySettingsService.settingChange$.subscribe((val) => {
      if (val && val.controlName === 'participantNames') {
        this.showUserName = val.state;
      }
      if (val && val.controlName === 'categorize') {
        this.sendMessage.emit(new BrainstormToggleCategoryModeEvent());
      }
      if (val && val.controlName === 'cardSize') {
        this.minWidth = val.state.name;
      }
    });
  }

  getPersonName(idea: Idea) {
    if (idea && idea.submitting_participant) {
      const user = this.joinedUsers.find(
        (u) => u.participant_code === idea.submitting_participant.participant_code
      );
      return user.display_name;
    }
  }

  getMinWidth() {
    return this.minWidth === 'small' ? 280 : this.minWidth === 'medium' ? 360 : 480;
  }

  ngOnDestroy() {
    this.contextService.destroyActivityTimer();
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
    if (this.peakBackState) {
      this.eventsSubscription.unsubscribe();
    }
  }
  changeStage(state) {
    this.peakBackStage = state;
    const act = this.activityState.brainstormactivity;
    if (state === 'next') {
    } else {
      // state === 'previous'
    }

    if (this.submissionScreen) {
      if (state === 'next') {
        this.voteScreen = true;
        this.submissionScreen = false;
        this.VnSComplete = false;
        this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
      } else {
        // state === 'previous'
        // do nothing
      }
    } else if (this.voteScreen) {
      if (state === 'next') {
        this.submissionScreen = false;
        this.voteScreen = false;
        this.VnSComplete = true;
      } else {
        // state === 'previous'
        this.submissionScreen = true;
        this.voteScreen = false;
        this.VnSComplete = false;
        this.ideaSubmittedUsersCount = this.act.submitted_participants.length;
      }
    } else if (this.VnSComplete) {
      if (state === 'next') {
        // do nothing
      } else {
        // state === 'previous'
        this.voteScreen = true;
        this.submissionScreen = false;
        this.VnSComplete = false;
        this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
      }
    }
  }

  onChanges() {
    this.loadUsersCounts();
    const act = this.activityState.brainstormactivity;
    this.act = this.activityState.brainstormactivity;
    if (this.act.brainstormcategory_set.length) {
      // check if the categories have ids
      // if categories don't have ids it means
      // we're in the preview panel
      if (this.act.brainstormcategory_set[0].id) {
        this.act.brainstormcategory_set = this.act.brainstormcategory_set.sort((a, b) => a.id - b.id);
      } else {
      }
    }
    this.joinedUsers = this.activityState.lesson_run.participant_set;

    this.instructions = act.instructions;

    this.categorizeFlag = act.categorize_flag;
    if (this.categorizeFlag) {
    }

    if (this.peakBackState && this.peakBackStage === null) {
      this.voteScreen = true;
      this.submissionScreen = false;
      this.VnSComplete = false;
      this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
    } else if (!this.peakBackState) {
      if (!act.submission_complete) {
        this.submissionScreen = true;
        this.voteScreen = false;
        this.VnSComplete = false;
        this.timer = act.submission_countdown_timer;
        this.ideaSubmittedUsersCount = this.act.submitted_participants.length;
      } else if (act.voting_countdown_timer && !act.voting_complete) {
        this.voteScreen = true;
        this.submissionScreen = false;
        this.VnSComplete = false;
        this.timer = act.voting_countdown_timer;
        this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
      } else if (act.submission_complete && act.voting_complete) {
        this.submissionScreen = false;
        this.voteScreen = false;
        this.VnSComplete = true;
        this.timer = this.getNextActStartTimer();
      }

      // show snackbar when submission is complete
      if (
        !this.editor &&
        !act.submission_complete &&
        !act.voting_complete &&
        this.isAllSubmissionsComplete(act) &&
        !this.shownSubmissionCompleteNofitication
      ) {
        this.shownSubmissionCompleteNofitication = true;
        const snackBarRef = this.utilsService.openSuccessNotification('Submission complete', 'Start voting');
        snackBarRef.onAction().subscribe(($event) => {});
      }
    }
  }

  loadUsersCounts() {
    this.joinedUsers = [];
    this.answeredParticipants = [];
    this.unansweredParticipants = [];
    this.joinedUsers = this.getActiveParticipants();

    // participant_vote_counts
    if (!this.voteScreen) {
      this.activityState.brainstormactivity.submitted_participants.forEach((code) => {
        this.answeredParticipants.push(this.getParticipantName(code.participant_code));
      });
    } else if (this.voteScreen) {
      this.activityState.brainstormactivity.participant_vote_counts.forEach((code) => {
        this.answeredParticipants.push(this.getParticipantName(code.participant_code));
      });
    }
    this.unansweredParticipants = this.getUnAnsweredUsers();
  }

  getUnAnsweredUsers() {
    const answered = this.answeredParticipants;
    const active = [];
    for (let index = 0; index < this.joinedUsers.length; index++) {
      active.push(this.joinedUsers[index].display_name);
    }
    return active.filter((name) => !answered.includes(name));
  }

  isAllSubmissionsComplete(act: BrainstormActivity): boolean {
    const maxSubmissions = act.max_participant_submissions;

    let submissions = 0;
    act.participant_submission_counts.forEach((element) => {
      submissions = submissions + element.count;
    });

    let activeParticipants = 0;
    this.activityState.lesson_run.participant_set.forEach((element) => {
      if (element.is_active) {
        activeParticipants = activeParticipants + 1;
      }
    });

    const totalMaxSubmissions = activeParticipants * maxSubmissions;
    const totalCurrentSubmissions = this.getUsersIdeas(act).length;

    if (totalMaxSubmissions === totalCurrentSubmissions) {
      return true;
    }

    return false;
  }

  ngOnChanges() {
    this.onChanges();
  }

  getUsersIdeas(act: BrainstormActivity): Array<Idea> {
    let arr: Array<Idea> = [];
    act.brainstormcategory_set.forEach((category) => {
      if (!category.removed) {
        category.brainstormidea_set.forEach((idea) => {
          if (!idea.removed) {
            arr.push(idea);
          }
        });
      }
    });
    arr = arr.filter(
      (v, i, s) => i === s.findIndex((t) => t.submitting_participant === v.submitting_participant)
    );
    return arr;
  }

  getVoteSubmittedUsersCount(act: BrainstormActivity) {
    return act.participant_vote_counts.length;
  }

  deleteIdea(id) {
    this.sendMessage.emit(new BrainstormRemoveSubmissionEvent(id));
  }
}

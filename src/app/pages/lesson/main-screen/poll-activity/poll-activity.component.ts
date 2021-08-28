import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ContextService } from 'src/app/services';
import { LeaderBoard, MCQChoiceSet, MCQSubmitAnswerEvent } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-poll',
  templateUrl: './poll-activity.component.html',
})
export class MainScreenPollComponent extends BaseActivityComponent implements OnInit, OnChanges, OnDestroy {
  radialTimer;
  showLeaderboard = false;
  leaderboard: Array<LeaderBoard> = [];
  revealAnswers = false;
  title = 'Pop Quiz!';
  regularDistribution = 100 / 4;
  joinedUsers = [];
  answeredParticipants = [];
  unansweredParticipants = [];

  @Input() peakBackState = false;
  @Input() activityStage: Observable<string>;
  @Input() editor = false;
  peakBackStage = null;
  private eventsSubscription: Subscription;
  constructor(private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.peakBackState) {
      this.eventsSubscription = this.activityStage.subscribe((state) => this.changeStage(state));
    }
    const act = this.activityState.pollactivity;
    if (act.question.mcqchoice_set[0] && act.question.mcqchoice_set[0].id) {
      act.question.mcqchoice_set.sort((a, b) => a.id - b.id);
    }
    if (act.titlecomponent) {
      this.title = act.titlecomponent.title;
    }

    if (this.editor) {
      const as = this.activityState;
      const qTimer = as.pollactivity.question_timer;
      this.radialTimer = qTimer;
    }
  }

  ngOnChanges() {
    this.loadUsersCounts();
    const as = this.activityState;
    const act = this.activityState.pollactivity;
    const qTimer = act.question_timer;
    const nt = this.getNextActStartTimer();

    if (act.question.mcqchoice_set[0] && act.question.mcqchoice_set[0].id) {
      act.question.mcqchoice_set.sort((a, b) => a.id - b.id);
    }
    if (this.peakBackState && this.peakBackStage === null) {
      // this.voteScreen = true;
      // this.submissionScreen = false;
      // this.VnSComplete = false;
      // this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
      // this.revealAnswers = true;
      // if (act.quiz_leaderboard) {
      //   this.showLeaderboard = true;
      //   this.leaderboard = act.quiz_leaderboard;
      //   this.leaderboard = this.leaderboard.sort((a, b) => {
      //     return b.score - a.score;
      //   });
      // }
    } else if (!this.peakBackState) {
      if (qTimer && (qTimer.status === 'running' || qTimer.status === 'paused')) {
        this.revealAnswers = false;
        this.radialTimer = qTimer;
        this.contextService.activityTimer = qTimer;
      } else if (nt && (nt.status === 'running' || nt.status === 'paused')) {
        this.revealAnswers = true;
        this.radialTimer = nt;
        // this.contextService.activityTimer = nt;
        this.contextService.destroyActivityTimer();
      }
    }
  }


  loadUsersCounts() {
    this.joinedUsers = this.activityState.lesson_run.participant_set;
    this.activityState.pollactivity.answered_participants.forEach((code) => {
      this.answeredParticipants.push(this.getParticipantName(code.participant_code));
    });
    this.unansweredParticipants = this.getUnAnsweredUsers();
  }

  getUnAnsweredUsers() {
    let answered = this.answeredParticipants;
    let active = [];
    for (let index = 0; index < this.joinedUsers.length; index++) {
      active.push(this.joinedUsers[index].display_name);
    }
    return (active.filter(name => !answered.includes(name)));
  }

  // For single user activity
  singleUserSubmitAnswer(option: MCQChoiceSet) {
    if (this.activityState.lesson.single_user_lesson) {
      this.sendMessage.emit(new MCQSubmitAnswerEvent([option]));
    }
  }

  getChoiceSubmittedUsers() {
    return this.activityState.pollactivity.answered_participants.length;
  }

  ngOnDestroy() {
    this.contextService.destroyActivityTimer();
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

    // if (this.submissionScreen) {
    //   if (state === 'next') {
    //     this.voteScreen = true;
    //     this.submissionScreen = false;
    //     this.VnSComplete = false;
    //     this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
    //   } else {
    //     // state === 'previous'
    //     // do nothing
    //   }
    // } else if (this.voteScreen) {
    //   if (state === 'next') {
    //     this.submissionScreen = false;
    //     this.voteScreen = false;
    //     this.VnSComplete = true;
    //   } else {
    //     // state === 'previous'
    //     this.submissionScreen = true;
    //     this.voteScreen = false;
    //     this.VnSComplete = false;
    //     this.ideaSubmittedUsersCount = this.getIdeaSubmittedUsersCount(act);
    //   }
    // } else if (this.VnSComplete) {
    //   if (state === 'next') {
    //     // do nothing
    //   } else {
    //     // state === 'previous'
    //     this.voteScreen = true;
    //     this.submissionScreen = false;
    //     this.VnSComplete = false;
    //     this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
    //   }
    // }
  }
}

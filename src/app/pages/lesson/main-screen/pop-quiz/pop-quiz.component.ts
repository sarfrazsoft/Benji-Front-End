import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ContextService } from 'src/app/services';
import { LeaderBoard, MCQChoiceSet, MCQSubmitAnswerEvent } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-pop-quiz',
  templateUrl: './pop-quiz.component.html',
})
export class MainScreenPopQuizComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges, OnDestroy {
  radialTimer;
  showLeaderboard = false;
  leaderboard: Array<LeaderBoard> = [];
  revealAnswers = false;
  title = 'Pop Quiz!';
  regularDistribution = 100 / 4;
  answeredParticipants = [];
  unansweredParticipants = [];
  activeParticipants = [];

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
    const act = this.activityState.mcqactivity;
    if (act.question.mcqchoice_set[0] && act.question.mcqchoice_set[0].id) {
      act.question.mcqchoice_set.sort((a, b) => a.id - b.id);
    }
    if (act.titlecomponent) {
      this.title = act.titlecomponent.title;
    }

    if (this.editor) {
      const as = this.activityState;
      const qTimer = as.mcqactivity.question_timer;
      this.radialTimer = qTimer;
    }
  }

  ngOnChanges() {

    this.activeParticipants = this.getActiveParticipants();
    this.answeredParticipants = this.activityState.mcqactivity.answered_participants;
    this.unansweredParticipants = this.getUnAnsweredUsers();

    const as = this.activityState;
    const qTimer = as.mcqactivity.question_timer;
    const nt = this.getNextActStartTimer();

    if (as.mcqactivity.question.mcqchoice_set[0] && as.mcqactivity.question.mcqchoice_set[0].id) {
      this.activityState.mcqactivity.question.mcqchoice_set.sort((a, b) => a.id - b.id);
    }
    if (this.peakBackState && this.peakBackStage === null) {
      // this.voteScreen = true;
      // this.submissionScreen = false;
      // this.VnSComplete = false;
      // this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
      this.revealAnswers = true;
      if (as.mcqactivity.quiz_leaderboard) {
        this.showLeaderboard = true;
        this.leaderboard = as.mcqactivity.quiz_leaderboard;
        this.leaderboard = this.leaderboard.sort((a, b) => {
          return b.score - a.score;
        });
      }
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
        if (as.mcqactivity.quiz_leaderboard) {
          this.showLeaderboard = true;
          this.leaderboard = as.mcqactivity.quiz_leaderboard;
          this.leaderboard = this.leaderboard.sort((a, b) => {
            return b.score - a.score;
          });
        }
      }
    }
  }

  // For single user activity
  singleUserSubmitAnswer(option: MCQChoiceSet) {
    if (this.activityState.lesson.single_user_lesson) {
      this.sendMessage.emit(new MCQSubmitAnswerEvent([option]));
    }
  }

  loadUserCounts() {
    this.answeredParticipants = this.activityState.mcqactivity.answered_participants;
    this.unansweredParticipants = this.getUnAnsweredUsers();
  }

  getUnAnsweredUsers() {
    let answered = [];
    let active = [];
    for (let index = 0; index < this.activeParticipants.length; index++) {
      active.push(this.activeParticipants[index].display_name);
    }
    for (let index = 0; index < this.answeredParticipants.length; index++) {
      answered.push(this.answeredParticipants[index].display_name);
    }
    return (active.filter(name => !answered.includes(name)));
  }

  getChoiceSubmittedUsers() {
    return this.activityState.mcqactivity.answered_participants.length;
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

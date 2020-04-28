import { Component, OnChanges, OnInit } from '@angular/core';
import {
  MCQChoiceSet,
  MCQSubmitAnswerEvent,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-pop-quiz',
  templateUrl: './pop-quiz.component.html',
  styleUrls: ['./pop-quiz.component.scss'],
})
export class MainScreenPopQuizComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  radialTimer;
  showLeaderboard = false;
  leaderboard = [];
  revealAnswers = false;
  title = 'Pop Quiz!';
  // leaderboard = [
  //   { name: 'Senpai', score: 9 },
  //   { name: 'Shikamaru', score: 7 },
  //   { name: 'Kakashi hatake', score: 4 },
  //   { name: 'Yamato tenzo', score: 2 },
  //   { name: 'Kazekage Gara', score: 1 }
  // ];
  constructor() {
    super();
  }

  optionIdentifiers = ['A', 'B', 'C', 'D', 'E', 'F'];

  ngOnInit() {
    this.activityState.mcqactivity.question.mcqchoice_set.sort(
      (a, b) => a.id - b.id
    );
    const act = this.activityState.mcqactivity;
    if (act.titlecomponent) {
      this.title = act.titlecomponent.title;
    }
  }

  ngOnChanges() {
    const as = this.activityState;
    this.activityState.mcqactivity.question.mcqchoice_set.sort(
      (a, b) => a.id - b.id
    );
    if (
      as.mcqactivity.question_timer &&
      (as.mcqactivity.question_timer.status === 'running' ||
        as.mcqactivity.question_timer.status === 'paused')
    ) {
      this.revealAnswers = false;
      this.radialTimer = as.mcqactivity.question_timer;
    } else if (
      as.base_activity.next_activity_start_timer &&
      (as.base_activity.next_activity_start_timer.status === 'running' ||
        as.base_activity.next_activity_start_timer.status === 'paused')
    ) {
      this.revealAnswers = true;
      this.radialTimer = as.base_activity.next_activity_start_timer;
      if (as.mcqactivity.quiz_leaderboard) {
        this.showLeaderboard = true;
        this.leaderboard = as.mcqactivity.quiz_leaderboard;
        this.leaderboard = this.leaderboard.sort((a, b) => {
          return b.score - a.score;
        });
      }
    }
  }

  // For single user activity
  singleUserSubmitAnswer(option: MCQChoiceSet) {
    if (this.activityState.lesson.single_user_lesson) {
      this.sendMessage.emit(new MCQSubmitAnswerEvent(option));
    }
  }

  getUserName(id) {
    const ju = this.activityState.lesson_run.joined_users;
    const user = ju.find((u) => u.id === id);
    if (user) {
      return user.first_name;
    } else {
      return 'user';
    }
  }
}

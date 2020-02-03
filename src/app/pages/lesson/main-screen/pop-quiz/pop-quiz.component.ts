import { Component, OnChanges, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-pop-quiz',
  templateUrl: './pop-quiz.component.html',
  styleUrls: ['./pop-quiz.component.scss']
})
export class MainScreenPopQuizComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  radialTimer;
  showLeaderboard = false;
  leaderboard = [
    { name: 'Senpai', score: 9 },
    { name: 'Shikamaru', score: 7 },
    { name: 'Kakashi hatake', score: 4 },
    { name: 'Yamato tenzo', score: 2 },
    { name: 'Kazekage Gara', score: 1 }
  ];
  constructor() {
    super();
  }

  optionIdentifiers = ['A', 'B', 'C', 'D', 'E', 'F'];

  ngOnInit() {
    this.activityState.mcqactivity.question.mcqchoice_set.sort(
      (a, b) => a.id - b.id
    );
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
      this.radialTimer = as.mcqactivity.question_timer;
    } else if (
      as.base_activity.next_activity_start_timer &&
      (as.base_activity.next_activity_start_timer.status === 'running' ||
        as.base_activity.next_activity_start_timer.status === 'paused')
    ) {
      this.radialTimer = as.base_activity.next_activity_start_timer;
    }
  }
}

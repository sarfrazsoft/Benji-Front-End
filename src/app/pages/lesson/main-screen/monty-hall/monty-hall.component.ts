import { Component, OnChanges, OnInit } from '@angular/core';
import { clone } from 'lodash';
import {
  FastForwardEvent,
  MontyHallActivity,
  MontyHallRepeatEvent,
  Timer,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-monty-hall',
  templateUrl: './monty-hall.component.html',
  styleUrls: ['./monty-hall.component.scss'],
})
export class MainScreenMontyHallComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  act: MontyHallActivity;
  timer: Timer;
  c_d;
  showDoorsScreen = true;
  showResultScreen = false;
  showChangeChoice = false;
  showRevealScreen = false;
  constructor() {
    super();
  }

  ngOnInit() {}

  ngOnChanges() {
    this.act = this.activityState.montyhallactivity;
    if (this.act.status === 'initial_choice') {
      this.timer = this.act.initial_choice_timer;
      this.showDoorsScreen = true;
      this.showChangeChoice = false;
      this.showResultScreen = false;
      this.showRevealScreen = false;
    } else if (this.act.status === 'change_choice') {
      this.timer = this.act.change_choice_timer;
      this.showChangeChoice = true;
      this.showRevealScreen = false;
    } else if (this.act.status === 'reveal') {
      // reveal_timer
      this.timer = this.act.reveal_timer;
      this.showRevealScreen = true;
      this.showDoorsScreen = false;
      this.showResultScreen = false;
      this.c_d = this.getCorrectChoiceForThisRound();
    } else if (this.act.status === 'results') {
      this.timer = this.act.results_timer;
      this.showResultScreen = true;
      this.showDoorsScreen = false;
      this.showRevealScreen = false;
    }
  }

  getCorrectChoiceForThisRound() {
    const details = clone(this.act.current_round_details);
    return details[details.length - 1].correct_door;
  }

  getInitialChoiceSelectedUsers() {
    const details = clone(this.act.current_round_details);
    const users = details.filter((u) => u.door_choice != null);
    return users.length;
  }

  getSwitchChoiceSelectedUsers() {
    const details = clone(this.act.current_round_details);
    const users = details.filter((u) => u.changed_choice != null);
    return users.length;
  }

  getSwitchedWinners() {
    let x = 0;
    this.act.results.forEach((r) => {
      x = x + r.winners_who_changed_choice;
    });
    return x;
  }

  getSwitchedLosers() {
    let x = 0;
    this.act.results.forEach((r) => {
      x = x + r.losers_who_changed_choice;
    });
    return x;
  }

  getSwitchedWinnerPercent() {
    let totalUsers = this.getSwitchedWinners() + this.getSwitchedLosers();
    if (totalUsers === 0) {
      totalUsers = 1;
    }
    const x = (this.getSwitchedWinners() / totalUsers) * 100;
    return Math.round(x * 10) / 10;
  }

  getStayedWinners() {
    let x = 0;
    this.act.results.forEach((r) => {
      x = x + r.winners_who_didnt_change;
    });
    return x;
  }

  getStayedLosers() {
    let x = 0;
    this.act.results.forEach((r) => {
      x = x + r.losers_who_didnt_change;
    });
    return x;
  }

  getStayedWinnerPercent() {
    let totalUsers = this.getStayedWinners() + this.getStayedLosers();
    if (totalUsers === 0) {
      totalUsers = 1;
    }
    const x = (this.getStayedWinners() / totalUsers) * 100;
    return Math.round(x * 10) / 10;
  }

  repeat() {
    this.sendMessage.emit(new MontyHallRepeatEvent());
  }

  finish() {
    this.sendMessage.emit(new FastForwardEvent());
  }
}

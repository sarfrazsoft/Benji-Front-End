import { useAnimation } from '@angular/animations';
import { Component, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import {
  BuildAPitchActivity,
  BuildAPitchSubmitEventEntry,
  BuildAPitchSubmitPitchEvent,
  BuildAPitchSubmitVoteEvent
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-build-pitch-activity',
  templateUrl: './build-pitch-activity.component.html',
  styleUrls: ['./build-pitch-activity.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParticipantBuildPitchActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  builtPitch_set;
  act: BuildAPitchActivity;
  createPitch = true;
  noPitchSubmitted = false;
  pitchValid = false;
  showMyPitch = false;
  voteNow = false;
  thanksForVote = false;
  lookAtWinningPitch = false;
  yourPitchWon = false;

  selectedUser = null;

  users = [
    {
      id: 1,
      name: 'Harold',
      pitch:
        'wing their businesses by providing funding because we want good ideas to succeed.'
    },
    {
      id: 2,
      name: 'Farah',
      pitch:
        'Georgian Partners helps <em>growth-stage software companies</em>' +
        ' with <em>growing their businesses</ em> by <em>providing funding</em>' +
        ' because <em>we want good ideas to succeed</em>.'
    }
  ];
  constructor() {
    super();
    this.builtPitch_set = [];
  }

  ngOnInit() {
    // how about we make the list of objects that
    // we are submitting to BE and each node can have an NgModel
    this.builtPitch_set = [];

    this.act = this.activityState.buildapitchactivity;

    this.act.buildapitchblank_set.forEach(v => {
      this.builtPitch_set.push({ ...v, ...{ value: null } });
    });
  }

  ngOnChanges() {
    this.act = this.activityState.buildapitchactivity;
    if (this.act.build_countdown_timer.status === 'ended') {
      this.createPitch = false;
      this.noPitchSubmitted = true;
    } else if (
      this.act.buildapitchpitch_set.filter(
        e => e.user === this.activityState.your_identity.id
      ).length > 0 &&
      !this.showMyPitch &&
      !this.voteNow &&
      !this.act.winning_user &&
      !this.act.voting_done &&
      !this.thanksForVote
    ) {
      this.createPitch = false;
      this.noPitchSubmitted = false;
      this.showMyPitch = true;
      this.voteNow = false;
    } else if (
      this.act.sharing_done &&
      !this.act.voting_done &&
      !this.thanksForVote &&
      this.act.vote_countdown_timer.status === 'running'
    ) {
      this.createPitch = false;
      this.showMyPitch = false;
      this.voteNow = true;
    } else if (
      this.act.voting_done &&
      this.act.winning_user &&
      this.thanksForVote
    ) {
      this.showMyPitch = false;
      this.voteNow = false;
      this.thanksForVote = false;
      if (this.act.winning_user.id === this.activityState.your_identity.id) {
        this.yourPitchWon = true;
      } else {
        this.lookAtWinningPitch = true;
      }
    }
  }

  checkValidity() {
    this.pitchValid = true;
    for (let i = 0; i < this.builtPitch_set.length; i++) {
      const element = this.builtPitch_set[i];
      if (
        this.builtPitch_set[i].value === null ||
        this.builtPitch_set[i].value === ''
      ) {
        this.pitchValid = false;
      }
    }
  }

  submitPitch() {
    const buildapitchsubmissionentry_set = [];
    this.builtPitch_set.forEach(p => {
      const buildAPitchSubmitEventEntry = new BuildAPitchSubmitEventEntry(
        p,
        p.value
      );
      buildapitchsubmissionentry_set.push(buildAPitchSubmitEventEntry);
    });

    this.sendMessage.emit(
      new BuildAPitchSubmitPitchEvent(buildapitchsubmissionentry_set)
    );
  }

  userSelected($event) {
    console.log($event);
    this.selectedUser = $event;
  }

  yourPitchText() {
    return this.getPitchText(this.activityState.your_identity.id);
  }

  getPitchText(userId) {
    const blanks = this.activityState.buildapitchactivity.buildapitchblank_set;
    const pitch = this.activityState.buildapitchactivity.buildapitchpitch_set.filter(
      e => e.user === userId
    )[0].buildapitchentry_set;

    let statement = '';
    blanks.forEach((b, i) => {
      statement = statement + b.label + ' <em>' + pitch[i].value + '</em> ';
    });
    console.log(statement);
    return statement;
  }

  getUserName(userId) {
    return this.activityState.lesson_run.joined_users.filter(
      u => u.id === userId
    )[0].first_name;
  }

  submitVote(user) {
    console.log(user);
    this.sendMessage.emit(new BuildAPitchSubmitVoteEvent(user));
    this.voteNow = false;
    this.showMyPitch = false;
    this.thanksForVote = true;
  }
}

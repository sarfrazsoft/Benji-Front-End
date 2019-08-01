import { useAnimation } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
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
  createPitch = false;
  pitchSubmitted = false;
  blankPitch = false;
  pitchValid = false;
  showMyPitch = false;
  voteNow = false;
  thanksForVote = false;
  userVoted = false;
  lookAtWinningPitch = false;
  yourPitchWon = false;
  expandedUserArray = {};

  selectedUser = null;

  constructor(private cdr: ChangeDetectorRef) {
    super();
    this.builtPitch_set = [];
  }

  ngOnInit() {
    // how about we make the list of objects that
    // we are submitting to BE and each node can have an NgModel
    this.builtPitch_set = [];

    this.act = this.activityState.buildapitchactivity;

    this.act.buildapitchblank_set
      .sort((a, b) => a.order - b.order)
      .forEach(v => {
        this.builtPitch_set.push({ ...v, ...{ value: null } });
      });
  }

  ngOnChanges() {
    this.act = this.activityState.buildapitchactivity;
    this.act.buildapitchblank_set = this.act.buildapitchblank_set.sort(
      (a, b) => a.order - b.order
    );
    if (
      this.act.build_countdown_timer.status === 'running' &&
      this.act.buildapitchpitch_set.filter(
        e => e.user === this.activityState.your_identity.id
      ).length === 0
    ) {
      this.createPitch = true;
    } else if (
      (this.act.buildapitchpitch_set.filter(
        e => e.user === this.activityState.your_identity.id
      ).length > 0 ||
        this.act.build_countdown_timer.status === 'ended') &&
      !this.showMyPitch &&
      !this.voteNow &&
      !this.act.winning_user &&
      !this.act.voting_done &&
      !this.thanksForVote
    ) {
      if (!this.pitchSubmitted) {
        this.pitchValid = true;
        this.submitPitch();
      }
      this.createPitch = false;
      this.showMyPitch = true;
      this.voteNow = false;
    } else if (
      this.act.sharing_done &&
      !this.act.voting_done &&
      !this.thanksForVote &&
      this.act.vote_countdown_timer.status === 'running'
    ) {
      if (
        Object.entries(this.expandedUserArray).length === 0 &&
        this.expandedUserArray.constructor === Object
      ) {
        this.fillExpandedUserArray();
      }
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

  fillExpandedUserArray() {
    // this.act.buildapitchblank_set.sort((a, b) => a.order - b.order);
    this.activityState.buildapitchactivity.buildapitchpitch_set.forEach(v => {
      this.expandedUserArray['' + v.user] = false;
    });
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
    if (!this.pitchValid) {
      return;
    }
    const buildapitchsubmissionentry_set = [];
    this.builtPitch_set.forEach(p => {
      if (p.value) {
        const buildAPitchSubmitEventEntry = new BuildAPitchSubmitEventEntry(
          p,
          p.value
        );
        buildapitchsubmissionentry_set.push(buildAPitchSubmitEventEntry);
      }
    });

    this.sendMessage.emit(
      new BuildAPitchSubmitPitchEvent(buildapitchsubmissionentry_set)
    );
    this.pitchSubmitted = true;
  }

  userSelected($event) {
    console.log($event);
    this.selectedUser = $event;
  }

  userExpanded($event) {
    this.expandedUserArray['' + $event] = true;
  }

  userCollapsed($event) {
    this.expandedUserArray['' + $event] = false;
  }

  yourPitchText() {
    return this.getPitchText(this.activityState.your_identity.id);
  }

  userPitchExists(userId) {
    // this.act.buildapitchblank_set.sort((a, b) => a.order - b.order);
    return this.activityState.buildapitchactivity.buildapitchpitch_set.filter(
      e => e.user === userId
    ).length;
  }

  getPitchText(userId) {
    this.act.buildapitchblank_set.sort((a, b) => a.order - b.order);
    const blanks = this.activityState.buildapitchactivity.buildapitchblank_set;
    const buildAPitchPitchSet = this.activityState.buildapitchactivity.buildapitchpitch_set.filter(
      e => e.user === userId
    );

    let statement = '';
    const buildAPitchEntrySet = buildAPitchPitchSet[0].buildapitchentry_set;
    blanks.forEach((b, i) => {
      const currentBlanksValue = buildAPitchEntrySet.filter(
        v => v.buildapitchblank === b.id
      );

      let value = '';
      if (currentBlanksValue.length === 1) {
        value = ' <em>' + currentBlanksValue[0].value + '</em> ';
      } else {
        value = ' <em class="warning-color">(' + b.temp_text + ')</em> ';
        this.blankPitch = true;
      }
      statement = statement + b.label + value;
    });
    return statement;
  }

  isPitchBlank(userId) {
    this.act.buildapitchblank_set.sort((a, b) => a.order - b.order);
    const blanks = this.activityState.buildapitchactivity.buildapitchblank_set;
    const buildAPitchPitchSet = this.activityState.buildapitchactivity.buildapitchpitch_set.filter(
      e => e.user === userId
    );

    // let statement = '';
    let blankPitch = false;
    const buildAPitchEntrySet = buildAPitchPitchSet[0].buildapitchentry_set;
    blanks.forEach((b, i) => {
      const currentBlanksValue = buildAPitchEntrySet.filter(
        v => v.buildapitchblank === b.id
      );

      if (currentBlanksValue.length === 0) {
        blankPitch = true;
      }
    });
    return blankPitch;
  }

  getUserName(userId) {
    return this.activityState.lesson_run.joined_users.filter(
      u => u.id === userId
    )[0].first_name;
  }

  submitVote(user) {
    if (!this.userVoted) {
      this.sendMessage.emit(new BuildAPitchSubmitVoteEvent(user));
      this.voteNow = false;
      this.showMyPitch = false;
      this.userVoted = true;
      this.thanksForVote = true;
    }
  }
}

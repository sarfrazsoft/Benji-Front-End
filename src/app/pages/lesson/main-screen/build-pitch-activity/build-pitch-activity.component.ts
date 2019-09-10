import { Component, OnChanges, OnInit } from '@angular/core';
import { BuildAPitchSharingDoneEvent } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-build-pitch-activity',
  templateUrl: './build-pitch-activity.component.html',
  styleUrls: ['./build-pitch-activity.component.scss']
})
export class MainScreenBuildPitchActivityComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  statement: string;
  constructor() {
    super();
  }
  createPitches = true;
  sharePitches = false;
  voteNow = false;
  votesComplete = false;

  ngOnInit() {
    const blanks: any = this.activityState.buildapitchactivity
      .buildapitchblank_set;

    blanks.sort((a, b) => a.order - b.order);

    this.statement = '';
    blanks.forEach(b => {
      this.statement =
        this.statement + b.label + ' <em>(' + b.temp_text + ')</em> ';
    });
  }

  ngOnChanges() {
    const act = this.activityState.buildapitchactivity;
    if (act.building_done && !act.sharing_done) {
      this.createPitches = false;
      this.sharePitches = true;
      this.voteNow = false;
      this.votesComplete = false;
    } else if (act.sharing_done && !act.voting_done) {
      this.createPitches = false;
      this.sharePitches = false;
      this.voteNow = true;
      this.votesComplete = false;
    } else if (act.sharing_done && act.voting_done && act.winning_user) {
      this.createPitches = false;
      this.sharePitches = false;
      this.voteNow = false;
      this.votesComplete = true;
    }
  }

  nextActivity() {
    this.sendMessage.emit(new BuildAPitchSharingDoneEvent());
  }

  getWinningPitch() {
    const votes = this.activityState.buildapitchactivity.votes;

    const v = Math.max.apply(
      Math,
      votes.map(function(o) {
        return o.num_votes;
      })
    );

    const obj = votes.find(function(o) {
      return o.num_votes === v;
    });

    return this.getPitchText(obj.id);
  }

  getPitchText(userId) {
    const blanks = this.activityState.buildapitchactivity.buildapitchblank_set;
    const buildAPitchPitchSet = this.activityState.buildapitchactivity.buildapitchpitch_set.filter(
      e => e.user === userId
    );

    let statement = '';
    const buildAPitchEntrySet = buildAPitchPitchSet[0].buildapitchentry_set;
    blanks.sort((a, b) => a.order - b.order);
    blanks.forEach((b, i) => {
      const currentBlanksValue = buildAPitchEntrySet.filter(
        v => v.buildapitchblank === b.id
      );

      let value = '';
      if (currentBlanksValue.length === 1) {
        value = ' <em>' + currentBlanksValue[0].value + '</em> ';
      } else {
        value = ' <em class="warning-color">(' + b.temp_text + ')</em> ';
      }
      statement = statement + b.label + value;
    });
    return statement;
  }
}

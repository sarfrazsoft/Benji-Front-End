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
    const blanks = this.activityState.buildapitchactivity.buildapitchblank_set;
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

    console.log(obj);
    console.log(this.getPitchText(obj.id));

    return this.getPitchText(obj.id);
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
}

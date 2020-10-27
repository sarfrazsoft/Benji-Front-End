import { Component, OnChanges, OnInit } from '@angular/core';
import { ContextService } from 'src/app/services';
import { BuildAPitchSharingDoneEvent } from 'src/app/services/backend/schema';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-build-pitch-activity',
  templateUrl: './build-pitch-activity.component.html',
  styleUrls: ['./build-pitch-activity.component.scss'],
})
export class MainScreenBuildPitchActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  statement: string;
  infoIcon: string;
  checkIcon: string;
  shareStartUser: string;
  winningUser: string;
  constructor(private contextService: ContextService) {
    super();
  }
  createPitches = true;
  sharePitches = false;
  voteNow = false;
  votesComplete = false;

  ngOnInit() {
    super.ngOnInit();
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.infoIcon = info.parameters.infoIcon;
        this.checkIcon = info.parameters.checkIcon;
      }
    });
    const blanks: any = this.activityState.buildapitchactivity.buildapitchblank_set;

    blanks.sort((a, b) => a.order - b.order);

    this.statement = '';
    blanks.forEach((b) => {
      this.statement = this.statement + b.label + ' <em class="primary-color">(' + b.temp_text + ')</em> ';
    });
  }

  ngOnChanges() {
    const act = this.activityState.buildapitchactivity;
    if (!act.building_done && !act.sharing_done && !act.voting_done) {
      this.createPitches = true;
      this.sharePitches = false;
      this.voteNow = false;
      this.votesComplete = false;
    } else if (act.building_done && !act.sharing_done) {
      this.shareStartUser = this.getParticipantName(act.share_start_participant.participant_code);
      this.createPitches = false;
      this.sharePitches = true;
      this.voteNow = false;
      this.votesComplete = false;
    } else if (act.sharing_done && !act.voting_done) {
      this.createPitches = false;
      this.sharePitches = false;
      this.voteNow = true;
      this.votesComplete = false;
    } else if (act.sharing_done && act.voting_done && act.winning_participant) {
      this.createPitches = false;
      this.sharePitches = false;
      this.voteNow = false;
      this.votesComplete = true;
      this.winningUser = this.getParticipantName(act.winning_participant.participant_code);
    }
  }

  nextActivity() {
    this.sendMessage.emit(new BuildAPitchSharingDoneEvent());
  }

  getWinningPitch(): string {
    const acts = this.activityState.buildapitchactivity;

    return this.getPitchText(acts.winning_participant.participant_code);
  }

  getPitchText(userId): string {
    const blanks = this.activityState.buildapitchactivity.buildapitchblank_set;
    const buildAPitchPitchSet = this.activityState.buildapitchactivity.buildapitchpitch_set.filter(
      (e) => e.participant.participant_code === userId
    );

    let statement = '';
    const buildAPitchEntrySet = buildAPitchPitchSet[0].buildapitchentry_set;
    blanks.sort((a, b) => a.order - b.order);
    blanks.forEach((b, i) => {
      const currentBlanksValue = buildAPitchEntrySet.filter((v) => v.buildapitchblank === b.id);

      let value = '';
      if (currentBlanksValue.length === 1) {
        value = ' <em class="primary-color">' + currentBlanksValue[0].value + '</em> ';
      } else {
        value = ' <em class="warning-color">(' + b.temp_text + ')</em> ';
      }
      statement = statement + b.label + value;
    });
    return statement;
  }
}

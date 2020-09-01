import { Component, OnChanges, OnInit } from '@angular/core';
import { concat, remove } from 'lodash';
import { ContextService, EmojiLookupService } from 'src/app/services';
import {
  Group,
  GroupingParticipantReadyEvent,
  ParticipantGroupStatus,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-triad-grouping-activity',
  templateUrl: './triad-grouping-activity.component.html',
  styleUrls: ['./triad-grouping-activity.component.scss'],
})
export class ParticipantTriadGroupingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  participantCode: number;
  partnerName: string;
  constructor(private emoji: EmojiLookupService, private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.participantCode = this.getParticipantCode();
  }
  ngOnChanges() {
    const timer = this.activityState.triadgroupingactivity.grouping_countdown_timer;
    this.contextService.activityTimer = timer;
  }

  myGroup(): Group {
    return this.activityState.triadgroupingactivity.group_set.find(
      (ug) =>
        ug.participantgroupstatus_set
          .map((u) => u.participant.participant_code)
          .indexOf(this.participantCode) > -1
    );
  }

  partnerText(): string {
    const myGroup: Group = this.myGroup();
    const myGroupWithoutMe = remove(
      concat(myGroup.participantgroupstatus_set, []),
      (e) => e.participant.participant_code !== this.participantCode
    );

    myGroupWithoutMe.sort((a, b) => a.participant.participant_code - b.participant.participant_code);

    if (myGroupWithoutMe.length === 1) {
      this.partnerName = this.getParticipantName(myGroupWithoutMe[0].participant.participant_code);
      return 'Your partner is ' + this.partnerName;
    } else {
      this.partnerName =
        this.getParticipantName(myGroupWithoutMe[0].participant.participant_code) +
        ' and ' +
        this.getParticipantName(myGroupWithoutMe[1].participant.participant_code);
      return (
        'Your partners are ' +
        this.getParticipantName(myGroupWithoutMe[0].participant.participant_code) +
        ' and ' +
        this.getParticipantName(myGroupWithoutMe[1].participant.participant_code)
      );
    }
  }

  myRoleplayUser(): ParticipantGroupStatus {
    const myGroup: Group = this.myGroup();

    return myGroup.participantgroupstatus_set.find(
      (g) => g.participant.participant_code === this.getParticipantCode()
    );
  }

  participantIsReady(): boolean {
    return this.myRoleplayUser().ready;
  }

  sendReadyState(): void {
    this.sendMessage.emit(new GroupingParticipantReadyEvent());
  }
}

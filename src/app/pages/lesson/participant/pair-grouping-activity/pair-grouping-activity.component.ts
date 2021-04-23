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
  selector: 'benji-ps-pair-grouping-activity',
  templateUrl: './pair-grouping-activity.component.html',
  styleUrls: ['./pair-grouping-activity.component.scss'],
})
export class ParticipantPairGroupingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  partnerName: string;
  constructor(private emoji: EmojiLookupService, private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges() {
    const timer = this.activityState.pairgroupingactivity.grouping_countdown_timer;
    this.contextService.activityTimer = timer;
  }

  myGroup(): Group {
    return this.activityState.pairgroupingactivity.group_set.find(
      (ug) => ug.participants.indexOf(this.getParticipantCode()) > -1
    );
  }

  partnerText(): string {
    // const myGroup = this.myGroup();
    // const myGroupWithoutMe = remove(
    //   concat(myGroup.participantgroupstatus_set, []),
    //   (e) => e.participant.participant_code !== this.getParticipantCode()
    // );
    // if (myGroupWithoutMe.length === 1) {
    //   this.partnerName = this.getParticipantName(myGroupWithoutMe[0].participant.participant_code);
    //   return 'Your partner is ' + this.partnerName;
    // } else {
    //   this.partnerName =
    //     this.getParticipantName(myGroupWithoutMe[0].participant.participant_code) +
    //     ' and ' +
    //     this.getParticipantName(myGroupWithoutMe[1].participant.participant_code);
    //   return (
    //     'Your partners are ' +
    //     this.getParticipantName(myGroupWithoutMe[0].participant.participant_code) +
    //     ' and ' +
    //     this.getParticipantName(myGroupWithoutMe[1].participant.participant_code)
    //   );
    // }
    return 'Default';
  }

  // myRoleplayUser(): ParticipantGroupStatus {
  //   const myGroup: Group = this.myGroup();

  //   return myGroup.participants.find((g) => g === this.getParticipantCode());
  // }

  participantIsReady(): boolean {
    // return this.myRoleplayUser().ready;
    return true;
  }

  sendReadyState(): void {
    this.sendMessage.emit(new GroupingParticipantReadyEvent());
  }
}

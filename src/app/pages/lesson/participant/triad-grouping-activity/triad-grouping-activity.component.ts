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
      (ug) => ug.participants.indexOf(this.participantCode) > -1
    );
  }

  partnerText(): string {
    // const myGroup: Group = this.myGroup();
    // const myGroupWithoutMe = remove(concat(myGroup.participants, []), (e) => e !== this.participantCode);

    // myGroupWithoutMe.sort((a, b) => a - b);

    // if (myGroupWithoutMe.length === 1) {
    //   this.partnerName = this.getParticipantName(myGroupWithoutMe[0]);
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
    return 'default';
  }

  participantIsReady(): boolean {
    return true;
  }

  sendReadyState(): void {
    this.sendMessage.emit(new GroupingParticipantReadyEvent());
  }
}

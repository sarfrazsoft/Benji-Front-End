import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EmojiLookupService } from 'src/app/services';
import { Group } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-pair-grouping-activity',
  templateUrl: './pair-grouping-activity.component.html',
  styleUrls: ['./pair-grouping-activity.component.scss'],
})
export class MainScreenPairGroupingActivityComponent extends BaseActivityComponent implements OnInit {
  constructor(private emoji: EmojiLookupService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  // getGroupText(userGroup: Group): string {
  //   return userGroup.participantgroupstatus_set
  //     .map((u) => this.getParticipantName(u.participant.participant_code))
  //     .join(' + ');
  // }

  // isReversed(): boolean {
  //   return (
  //     this.activityState.roleplaypairactivity.reverse_group_activity !== null &&
  //     this.activityState.roleplaypairactivity.reverse_group_activity !== undefined
  //   );
  // }

  // isGroupFound(userGroup: Group): boolean {
  //   return !userGroup.participantgroupstatus_set.find((ug) => !ug.ready);
  // }
}

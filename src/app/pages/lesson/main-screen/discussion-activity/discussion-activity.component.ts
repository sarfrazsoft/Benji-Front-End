import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DiscussionGroup } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-discussion-activity',
  templateUrl: './discussion-activity.component.html',
  styleUrls: ['./discussion-activity.component.scss'],
})
export class MainScreenDiscussionActivityComponent extends BaseActivityComponent implements OnInit {
  @ViewChild('shareTimer') shareTimer;

  ngOnInit() {
    super.ngOnInit();
  }

  presenterGroupToText(presenterGroup: DiscussionGroup) {
    if (presenterGroup === undefined || presenterGroup == null) {
      return undefined;
    }

    const presenterNameList = presenterGroup.discussiongroupmember_set.map((u) =>
      this.getParticipantName(u.participant.participant_code)
    );

    if (presenterNameList.length === 1) {
      return presenterNameList[0];
    }

    let text = presenterNameList.splice(0, presenterNameList.length - 1).join(', ');
    text += ' and ' + presenterNameList[0];
    return text;
  }
}

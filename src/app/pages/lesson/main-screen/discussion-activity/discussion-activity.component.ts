import { Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DiscussionGroup } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-discussion-activity',
  templateUrl: './discussion-activity.component.html',
  styleUrls: ['./discussion-activity.component.scss']
})
export class MainScreenDiscussionActivityComponent extends BaseActivityComponent {
  @ViewChild('shareTimer') shareTimer;

  presenterGroupToText(presenterGroup: DiscussionGroup) {
    if (presenterGroup === undefined || presenterGroup == null) {
      return undefined;
    }

    const presenterNameList = presenterGroup.discussiongroupmember_set.map(
      u => u.user.first_name
    );
    let text = presenterNameList
      .splice(0, presenterNameList.length - 1)
      .join(', ');
    text += ' and ' + presenterNameList[0];
    return text;
  }
}

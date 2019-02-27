import { Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import {DiscussionGroup} from '../../../../services/backend/schema/activities';

@Component({
  selector: 'app-main-screen-discussion-activity',
  templateUrl: './main-screen-discussion-activity.component.html',
  styleUrls: ['./main-screen-discussion-activity.component.scss']
})
export class MainScreenDiscussionActivityComponent extends BaseActivityComponent {
  @ViewChild('shareTimer') shareTimer;

  presenterGroupToText(presenterGroup: DiscussionGroup) {
    if (presenterGroup === undefined) {
      return undefined;
    }

    const presenterNameList = presenterGroup.discussiongroupmember_set.map(u => u.user.first_name);
    let text = presenterNameList
      .splice(0, presenterNameList.length - 1)
      .join(', ');
    text += ' and ' + presenterNameList[0];
    return text;
  }
}

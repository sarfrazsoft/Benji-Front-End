import { Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { RoleplayUserGroup } from '../../../../services/backend/schema/activity';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'app-main-screen-discussion-activity',
  templateUrl: './main-screen-discussion-activity.component.html',
  styleUrls: ['./main-screen-discussion-activity.component.scss']
})
export class MainScreenDiscussionActivityComponent extends BaseActivityComponent
  implements OnChanges {
  @ViewChild('shareTimer') shareTimer;

  presenterGroupToList(presenterGroup: RoleplayUserGroup) {
    return presenterGroup.primary.concat(presenterGroup.secondary);
  }

  presenterGroupToText(presenterGroup: RoleplayUserGroup) {
    if (presenterGroup === undefined) {
      return undefined;
    }

    const presenterList = this.presenterGroupToList(presenterGroup);
    const presenterNameList = presenterList.map(u => this.idToName(u));
    let text = presenterNameList
      .splice(0, presenterNameList.length - 1)
      .join(', ');
    text += ' and ' + presenterNameList[0];
    return text;
  }

  initDiscussionTimer(timer) {
    const discussionTotalTime =
      Date.parse(this.activityState.activity_status.discussion_countdown_time) -
      Date.now();
    const discussionTimeElapsed = 0;
    timer.startTimer(discussionTotalTime, discussionTimeElapsed);
  }

  initShareTimer(timer) {
    if (timer.running) {
      timer.stopTimer();
    }
    const shareTimeStr = this.activityState.activity_status
      .sharer_countdown_time[
      this.activityState.activity_status.sharer_group_num
    ];
    const shareTotalTime = Date.parse(shareTimeStr) - Date.now();
    const shareTimeElapsed = 0;
    timer.startTimer(shareTotalTime, shareTimeElapsed);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['activityState'] &&
      changes['activityState'].previousValue &&
      changes['activityState'].previousValue.activity_status
        .sharer_group_num !==
        changes['activityState'].currentValue.activity_status
          .sharer_group_num &&
      changes['activityState'].currentValue.activity_status.sharer_group_num !==
        null
    ) {
      if (
        this.activityState.activity_status.sharer_group_num <
          this.activityState.activity_status.sharer_countdown_time.length &&
        this.shareTimer
      ) {
        this.initShareTimer(this.shareTimer);
      }
    }
  }

  currentPresenterGroup() {
    return this.activityState.activity_status.selected_sharers[
      this.activityState.activity_status.sharer_group_num
    ];
  }

  nextPresenterGroup() {
    if (
      this.activityState.activity_status.selected_sharers.length <
      this.activityState.activity_status.sharer_group_num + 1
    ) {
      return this.activityState.activity_status.selected_sharers[
        this.activityState.activity_status.sharer_group_num
      ];
    } else {
      return undefined;
    }
  }
}

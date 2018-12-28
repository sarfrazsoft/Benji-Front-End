import {Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import {BaseActivityComponent} from '../../shared/base-activity.component';
import {RoleplayUserGroup} from '../../../../services/backend/schema/activity';

@Component({
  selector: 'app-main-screen-discussion-activity',
  templateUrl: './main-screen-discussion-activity.component.html',
  styleUrls: ['./main-screen-discussion-activity.component.scss']
})

export class MainScreenDiscussionActivityComponent extends BaseActivityComponent implements OnInit, OnChanges, OnDestroy {


  discussionTimeElapsed: number;
  discussionTotalTime: number;
  discussionInterval;
  discussionTimerRunning = true;

  shareTimeElapsed: number;
  shareTotalTime: number;
  shareInterval;
  shareTimerRunning = false;

  static presenterGroupToList(presenterGroup: RoleplayUserGroup) {
    return presenterGroup.primary.concat(presenterGroup.secondary);
  }

  presenterGroupToText(presenterGroup: RoleplayUserGroup) {
    if (presenterGroup === undefined) {
      return undefined;
    }

    const presenterList = MainScreenDiscussionActivityComponent.presenterGroupToList(presenterGroup);
    const presenterNameList = presenterList.map((u) => this.idToName(u));
    let text = presenterNameList.splice(0, presenterNameList.length - 1).join(', ');
    text += ' and ' + presenterNameList[0];
    return text;
  }

  ngOnInit() {
    this.discussionTotalTime = Date.parse(this.activityState.activity_status.discussion_countdown_time) - Date.now();
    this.discussionTimeElapsed = 0;

    this.discussionInterval = setInterval(() => {
      if (this.discussionTimeElapsed < this.discussionTotalTime) {
        this.discussionTimeElapsed = this.discussionTimeElapsed + 100;
      }
    }, 100);

    this.discussionTimerRunning = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activityState'] &&
            (changes['activityState'].previousValue.activity_status.discussion_complete !==
            changes['activityState'].currentValue.activity_status.discussion_complete) &&
            changes['activityState'].currentValue.activity_status.discussion_complete) {
      if (this.discussionTimerRunning) {
        clearInterval(this.discussionInterval);
        this.discussionTimerRunning = false;
      }
    }

    if (changes['activityState'] &&
            (changes['activityState'].previousValue.activity_status.sharer_group_num !==
              changes['activityState'].currentValue.activity_status.sharer_group_num) &&
            changes['activityState'].currentValue.activity_status.sharer_group_num !== null) {

      if (this.shareTimerRunning) {
        clearInterval(this.shareInterval);
        this.shareTimerRunning = false;
      }

      if (this.activityState.activity_status.sharer_group_num < this.activityState.activity_status.sharer_countdown_time.length - 1) {
        const shareTimeStr = this.activityState.activity_status.sharer_countdown_time[this.activityState.activity_status.sharer_group_num];
        this.shareTotalTime = Date.parse(shareTimeStr) - Date.now();
        this.shareTimeElapsed = 0;

        this.shareInterval = setInterval(() => {
          if (this.shareTimeElapsed < this.shareTotalTime) {
            this.shareTimeElapsed = this.shareTimeElapsed + 100;
          }
        }, 100);
        this.shareTimerRunning = true;
      }
    }
  }

  ngOnDestroy() {
    if (this.discussionTimerRunning) {
      clearInterval(this.discussionInterval);
    }
    if (this.shareTimerRunning) {
      clearInterval(this.shareInterval);
    }
  }

  currentPresenterGroup() {
    return this.activityState.activity_status.selected_sharers[this.activityState.activity_status.sharer_group_num];
  }

  nextPresenterGroup() {
    if (this.activityState.activity_status.selected_sharers.length < this.activityState.activity_status.sharer_group_num + 1) {
      return this.activityState.activity_status.selected_sharers[this.activityState.activity_status.sharer_group_num];
    } else {
      return undefined;
    }
  }
}

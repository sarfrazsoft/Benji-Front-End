import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { filter } from 'lodash';
import { ActivityDisplayNames, ActivityThumbnails, ActivityTitles } from 'src/app/globals';
import { BackendRestService } from 'src/app/services';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { Lesson } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-session-navigation',
  templateUrl: './session-navigation.component.html',
  styleUrls: [],
})
export class SessionNavigationComponent implements OnInit {
  @Input() activityState: UpdateMessage;
  @Input() disableControls: boolean;
  AT = ActivityThumbnails;
  DisplayNames = ActivityDisplayNames;
  ActivityTitles = ActivityTitles;
  votingSetup = false;
  votingStarted = true;
  activities = [];
  @Output() navigate = new EventEmitter<any>();

  constructor(private backendRestService: BackendRestService) {}

  ngOnInit(): void {
    if (!this.disableControls) {
      this.backendRestService
        .getLessonRunActivities(this.activityState.lesson_run.lessonrun_code)
        .subscribe((activities: any) => {
          activities.forEach((activity) => {
            if (
              activity.activity_type !== 'MCQResultsActivity' &&
              activity.activity_type !== 'LobbyActivity'
            ) {
              this.activities.push(activity);
            }
          });
          this.activities = this.activities.sort((a, b) => a.id - b.id);
        });
    }
  }

  getDescText(act) {
    return this.getDescendantProp(act, this.ActivityTitles[act.activity_type]);
  }

  getDescendantProp(obj, desc) {
    if (desc) {
      const arr = desc.split('.');
      while (arr.length && (obj = obj[arr.shift()])) {}
      return obj;
    }
  }

  navigateToActivity(act) {
    this.navigate.emit(act.id);
    // console.log(act);
  }
}

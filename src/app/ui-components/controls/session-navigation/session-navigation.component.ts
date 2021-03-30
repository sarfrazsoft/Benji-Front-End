import { Component, Input, OnInit } from '@angular/core';
import { ActivityDisplayNames, ActivityThumbnails, ActivityTitles } from 'src/app/globals';
import { BackendRestService } from 'src/app/services';
import { Lesson } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-session-navigation',
  templateUrl: './session-navigation.component.html',
  styleUrls: [],
})
export class SessionNavigationComponent implements OnInit {
  @Input() lesson: Lesson;
  @Input() disableControls: boolean;
  AT = ActivityThumbnails;
  DisplayNames = ActivityDisplayNames;
  ActivityTitles = ActivityTitles;
  votingSetup = false;
  votingStarted = true;
  activities = [];
  constructor(private backendRestService: BackendRestService) {}

  ngOnInit(): void {
    if (!this.disableControls) {
      this.backendRestService.getLessonActivities(this.lesson.id).subscribe((val: any) => {
        this.activities = val.lesson_plan_json;
        console.log(this.activities);
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
}

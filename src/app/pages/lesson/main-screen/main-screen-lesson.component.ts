import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityTypes } from 'src/app/globals';
import {
  BackendRestService,
  BackendSocketService,
  ContextService
} from 'src/app/services';
import { BaseLessonComponent } from '../shared/base-lesson.component';

@Component({
  selector: 'benji-main-screen-lesson',
  templateUrl: './main-screen-lesson.component.html',
  styleUrls: ['./main-screen-lesson.component.scss']
})
export class MainScreenLessonComponent extends BaseLessonComponent
  implements OnInit {
  at: typeof ActivityTypes = ActivityTypes;
  constructor(
    protected restService: BackendRestService,
    protected route: ActivatedRoute,
    protected socketService: BackendSocketService,
    protected contextService: ContextService,
    protected ref: ChangeDetectorRef
  ) {
    super(restService, route, socketService, 'screen', contextService, ref);
  }

  fastForwardActivities = [
    this.at.pitchoMatic,
    this.at.buildAPitch,
    this.at.rolePlayPair,
    this.at.mcqResults,
    this.at.discussion,
    this.at.genericRoleplay,
    this.at.externalGrouping
  ];
}

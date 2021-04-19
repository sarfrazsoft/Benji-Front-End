import { ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ActivityTypes } from 'src/app/globals';
import {
  AuthService,
  BackendRestService,
  BackendSocketService,
  ContextService,
  SharingToolService,
} from 'src/app/services';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { BaseLessonComponent } from '../shared/base-lesson.component';

@Component({
  selector: 'benji-main-screen-lesson',
  templateUrl: './main-screen-lesson.component.html',
})
export class MainScreenLessonComponent extends BaseLessonComponent implements OnInit {
  constructor(
    protected utilsService: UtilsService,
    protected restService: BackendRestService,
    protected activatedRoute: ActivatedRoute,
    protected socketService: BackendSocketService,
    protected contextService: ContextService,
    protected authService: AuthService,
    protected ref: ChangeDetectorRef,
    protected matSnackBar: MatSnackBar,
    protected sharingToolService: SharingToolService
  ) {
    super(
      utilsService,
      restService,
      activatedRoute,
      socketService,
      'screen',
      contextService,
      authService,
      ref,
      matSnackBar
    );
  }
  at: typeof ActivityTypes = ActivityTypes;

  fastForwardActivities = [
    this.at.pitchoMatic,
    this.at.buildAPitch,
    this.at.rolePlayPair,
    this.at.mcqResults,
    this.at.mcq,
    this.at.discussion,
    this.at.genericRoleplay,
    this.at.externalGrouping,
    this.at.whereDoYouStand,
    this.at.brainStorm,
    this.at.montyHall,
  ];

  isPaused() {
    const activity_type = this.serverMessage.activity_type.toLowerCase();
    return this.serverMessage[activity_type].is_paused;
  }
}

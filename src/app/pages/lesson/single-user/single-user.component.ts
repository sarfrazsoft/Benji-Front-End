import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { ActivityTypes } from 'src/app/globals';
import { AuthService, BackendRestService, BackendSocketService, ContextService } from 'src/app/services';
import { UtilsService } from 'src/app/services/utils.service';
import { BaseLessonComponent } from '../shared/base-lesson.component';

@Component({
  selector: 'benji-single-user-lesson',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.scss'],
})
export class SingleUserComponent extends BaseLessonComponent implements OnInit {
  at: typeof ActivityTypes = ActivityTypes;
  constructor(
    protected utilsService: UtilsService,
    protected restService: BackendRestService,
    protected route: ActivatedRoute,
    protected socketService: BackendSocketService,
    protected contextService: ContextService,
    protected authService: AuthService,
    protected permissionsService: NgxPermissionsService,
    protected ref: ChangeDetectorRef,
    protected matSnackBar: MatSnackBar
  ) {
    super(
      utilsService,
      restService,
      route,
      socketService,
      'participant',
      contextService,
      authService,
      permissionsService,
      ref,
      matSnackBar
    );
  }

  isPaused() {
    const activity_type = this.serverMessage.activity_type.toLowerCase();
    return this.serverMessage[activity_type].is_paused;
  }
}

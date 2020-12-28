import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ActivityTypes } from 'src/app/globals';
import { AuthService, BackendRestService, BackendSocketService, ContextService } from 'src/app/services';
import { BaseLessonComponent } from '../shared/base-lesson.component';

@Component({
  selector: 'benji-single-user-lesson',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.scss'],
})
export class SingleUserComponent extends BaseLessonComponent implements OnInit {
  at: typeof ActivityTypes = ActivityTypes;
  constructor(
    protected restService: BackendRestService,
    protected route: ActivatedRoute,
    protected socketService: BackendSocketService,
    protected contextService: ContextService,
    protected authService: AuthService,
    protected ref: ChangeDetectorRef,
    protected matSnackBar: MatSnackBar
  ) {
    super(restService, route, socketService, 'participant', contextService, authService, ref, matSnackBar);
  }

  isPaused() {
    const activity_type = this.serverMessage.activity_type.toLowerCase();
    return this.serverMessage[activity_type].is_paused;
  }
}

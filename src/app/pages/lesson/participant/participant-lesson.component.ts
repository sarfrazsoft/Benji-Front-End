import { ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ActivityTypes } from 'src/app/globals';
import { AuthService, ContextService } from 'src/app/services';
import { BackendRestService } from 'src/app/services/backend/backend-rest.service';
import { BackendSocketService } from 'src/app/services/backend/backend-socket.service';
import { BaseLessonComponent } from '../shared/base-lesson.component';

@Component({
  selector: 'benji-participant-lesson',
  templateUrl: './participant-lesson.component.html',
  styleUrls: ['./participant-lesson.component.scss'],
})
export class ParticipantLessonComponent extends BaseLessonComponent {
  at: typeof ActivityTypes = ActivityTypes;
  constructor(
    protected restService: BackendRestService,
    protected route: ActivatedRoute,
    protected socketService: BackendSocketService,
    protected ref: ChangeDetectorRef,
    protected authService: AuthService,
    protected contextService: ContextService,
    protected matSnackBar: MatSnackBar
  ) {
    super(
      restService,
      route,
      socketService,
      'participant',
      contextService,
      authService,
      ref,
      matSnackBar
    );
  }
}

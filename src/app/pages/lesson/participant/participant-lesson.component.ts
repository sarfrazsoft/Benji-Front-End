import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ActivityTypes } from 'src/app/globals';
import { AuthService, ContextService } from 'src/app/services';
import { BackendRestService } from 'src/app/services/backend/backend-rest.service';
import { BackendSocketService } from 'src/app/services/backend/backend-socket.service';
import { UtilsService } from 'src/app/services/utils.service';
import { BaseLessonComponent } from '../shared/base-lesson.component';

@Component({
  selector: 'benji-participant-lesson',
  templateUrl: './participant-lesson.component.html',
})
export class ParticipantLessonComponent extends BaseLessonComponent {
  at: typeof ActivityTypes = ActivityTypes;
  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    console.log('Processing beforeunload...');
    event.returnValue = false;
  }
  constructor(
    protected utilsService: UtilsService,
    protected restService: BackendRestService,
    protected route: ActivatedRoute,
    protected socketService: BackendSocketService,
    protected ref: ChangeDetectorRef,
    protected authService: AuthService,
    protected contextService: ContextService,
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
      ref,
      matSnackBar
    );
  }

  canDeactivate() {
    return confirm('Do you really want to leave?');
  }
}

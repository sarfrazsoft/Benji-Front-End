import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BackendRestService } from 'src/app/services/backend/backend-rest.service';
import { BackendSocketService } from 'src/app/services/backend/backend-socket.service';

import { BaseLessonComponent } from '../shared/base-lesson.component';

@Component({
  selector: 'benji-participant-lesson',
  templateUrl: './participant-lesson.component.html',
  styleUrls: ['./participant-lesson.component.scss']
})
export class ParticipantLessonComponent extends BaseLessonComponent {
  constructor(
    protected restService: BackendRestService,
    protected route: ActivatedRoute,
    protected socketService: BackendSocketService,
    protected ref: ChangeDetectorRef
  ) {
    super(restService, route, socketService, 'participant', ref);
  }
}

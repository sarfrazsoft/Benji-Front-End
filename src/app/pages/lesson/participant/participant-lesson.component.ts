import { Component, OnInit } from '@angular/core';
import { BackendRestService } from '../../../services/backend/backend-rest.service';
import { BackendSocketService} from '../../../services/backend/backend-socket.service';
import { ActivatedRoute } from '@angular/router';

import { BaseLessonComponent } from '../shared/base-lesson.component';
import {ActivityFlowFrame} from '../../../services/backend/schema/activity';

@Component({
  selector: 'app-participant-lesson',
  templateUrl: './participant-lesson.component.html',
  styleUrls: ['./participant-lesson.component.scss']
})
export class ParticipantLessonComponent extends BaseLessonComponent implements OnInit {
  constructor(protected restService: BackendRestService, protected route: ActivatedRoute, protected socketService: BackendSocketService) {
    super(restService, route, socketService, 'participant');
  }
}

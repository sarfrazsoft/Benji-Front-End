import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';

import { BaseLessonComponent } from '../shared/base-lesson.component';

import { ActivatedRoute } from '@angular/router';
import { BackendSocketService } from '../../../services/backend/backend-socket.service';
import { BackendRestService } from '../../../services/backend/backend-rest.service';
import {ActivityFlowFrame} from '../../../services/backend/schema/activity';

@Component({
  selector: 'app-main-screen-lesson',
  templateUrl: './main-screen-lesson.component.html',
  styleUrls: ['./main-screen-lesson.component.scss']
})
export class MainScreenLessonComponent extends BaseLessonComponent implements OnInit {
  constructor(protected restService: BackendRestService, protected route: ActivatedRoute, protected socketService: BackendSocketService) {
    super(restService, route, socketService, 'screen');
  }
}

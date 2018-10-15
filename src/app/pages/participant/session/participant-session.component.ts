import { Component, ViewEncapsulation } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { ActivatedRoute } from '@angular/router';

import {WebSocketService} from '../../../services/socket.service';
import {BaseSessionComponent} from '../../shared/base-session.component';
import { CurrentActivityStatus } from '../../../models/activity';


@Component({
  selector: 'app-participant-session',
  templateUrl: './participant-session.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class ParticipantSessionComponent extends BaseSessionComponent {

  constructor(protected backend: BackendService, protected route: ActivatedRoute, protected ws: WebSocketService) {
    super(backend, route, ws);
  }

  activityUpdate(resp: CurrentActivityStatus) {
    if (resp.current_activity) {
      if (!this.activityStatus || !this.activityStatus.current_activity ||
        this.activityStatus.current_activity.id !== resp.current_activity.id) {
        this.backend.join_activity(resp.current_activityrun.id).subscribe();
      }
    }
    super.activityUpdate(resp);
  }
}

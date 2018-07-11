import { Component, ViewEncapsulation } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { ActivatedRoute } from '@angular/router';

import {WebsocketService} from '../../../services/socket.service';
import {BaseSessionComponent} from '../../shared/base-session.component';
import {CurrentActivityStatus} from '../../../models/benji_models';


@Component({
  selector: 'app-mobile-session',
  templateUrl: './mobile-session.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileSessionComponent extends BaseSessionComponent {

  constructor(protected backend: BackendService, protected route: ActivatedRoute, protected ws: WebsocketService) {
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

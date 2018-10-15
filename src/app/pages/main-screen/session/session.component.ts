import { Component, ViewEncapsulation } from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {WebSocketService} from '../../../services/socket.service';
import { ActivatedRoute } from '@angular/router';

import { BaseSessionComponent } from '../../shared/base-session.component';

@Component({
  selector: 'app-mainscreen-session',
  templateUrl: './session.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class SessionComponent extends BaseSessionComponent {

  constructor(protected backend: BackendService, protected route: ActivatedRoute, protected ws: WebSocketService) {
    super(backend, route, ws);
  }

  next_activity(val: boolean) {
    if (val) {
      this.backend.start_next_activity(this.sessionRunID).subscribe();
    }
  }
}

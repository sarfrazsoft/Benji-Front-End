import { OnInit } from '@angular/core';

import {BackendService} from '../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {WebSocketService} from '../../services/socket.service';

import { CurrentActivityStatus } from '../../models/activity';
import { User } from '../../models/user';


export class BaseSessionComponent implements OnInit {
  protected sessionRunID: string;
  protected sessionRunDetails;
  protected activityStatus: CurrentActivityStatus;
  protected clientIdentity: User;

  protected sessionSocket;

  destroyComponents = false;

  constructor(protected backend: BackendService, protected route: ActivatedRoute, protected ws: WebSocketService) {
    this.sessionRunID = route.snapshot.params['sessionRunID'];
  }

  ngOnInit() {
    this.backend.get_sessionrun_details(this.sessionRunID).subscribe(
      resp => this.sessionRunDetails = resp,
      err => console.log(err)
    );

    this.backend.get_own_identity().subscribe(
      resp => this.clientIdentity = resp,
      err => console.log(err)
    );

    this.sessionSocket = this.ws.getSessionSocket(this.sessionRunID)
      .subscribe((message: CurrentActivityStatus) => this.activityUpdate(message),
        (err) => console.log(err),
      () => console.log('complete'));
  }

  activityUpdate(resp: CurrentActivityStatus) {
    console.log(resp);
    if (this.activityStatus && resp.current_activity && this.activityStatus.current_activity && this.activityStatus.current_activity.id !== resp.current_activity.id) {
      this.destroyComponents = true;
      setTimeout(() => this.destroyComponents = false, 50);
    }
    this.activityStatus = resp;
  }

}

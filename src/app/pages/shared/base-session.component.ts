import { OnInit } from '@angular/core';

import {BackendService} from '../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {WebsocketService} from '../../services/socket.service';

import {CurrentActivityStatus, User} from '../../models/benji_models';


export class BaseSessionComponent implements OnInit {
  protected sessionRunID: string;
  protected sessionRunDetails;
  protected activityStatus: CurrentActivityStatus;
  protected clientIdentity: User;

  protected sessionSocket;

  constructor(protected backend: BackendService, protected route: ActivatedRoute, protected ws: WebsocketService) {
    this.sessionRunID = route.snapshot.params['sessionRunID'];
    this.sessionRunDetails = {'sessionrun_code': 0, 'session': {'session_name': '', 'session_length': 0, 'session_description': ''}};
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
      .subscribe((message: CurrentActivityStatus) => {
        this.activityUpdate(message);
      });
  }

  next_activity(val: boolean) {
    if (val) {
      this.backend.start_next_activity(this.sessionRunID).subscribe();
    }
  }

  activityUpdate(resp: CurrentActivityStatus) {
    console.log(resp);
    this.activityStatus = resp;
  }

}

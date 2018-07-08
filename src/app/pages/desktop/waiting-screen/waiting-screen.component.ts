import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {WebsocketService} from '../../../services/socket.service';
import { ActivatedRoute, Router } from '@angular/router';


import { LobbyStatus } from '../../../models/benji_models';

@Component({
  selector: 'app-desktop-waiting-screen',
  templateUrl: './waiting-screen.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class WaitingScreenComponent implements OnInit, OnDestroy {
  sessionRunID: string;
  sessionRunDetails;
  whosHere: LobbyStatus;

  lobbySocket;

  constructor(private backend: BackendService, route: ActivatedRoute, private router: Router, private ws: WebsocketService) {
    this.sessionRunID = route.snapshot.params['sessionRunID'];
    this.sessionRunDetails = {'sessionrun_code': 0, 'session': {'session_name': 'Loading...'}};
    this.whosHere = {'joined_users': [], 'missing_users': [], 'started': false};
  }

  ngOnInit() {
    this.backend.get_sessionrun_details(this.sessionRunID).subscribe(
      resp => this.sessionRunDetails = resp,
      err => console.log(err)
    );

    this.lobbySocket = this.ws.getLobbySocket(this.sessionRunID)
      .subscribe((message: LobbyStatus) => {
        this.handleUpdate(message);
      }, (err) => console.log(err),
      () => console.log('complete'));
  }

  ngOnDestroy() {
    console.log('Destroying websocket connection');
    this.lobbySocket.unsubscribe();
  }

  handleUpdate(resp: LobbyStatus) {
    this.whosHere = resp;
    console.log(resp);
    if (this.whosHere.started) {
      this.router.navigate(['/desktop/session', {'sessionRunID': this.sessionRunID}]);
    }
  }

  startFirstActivity() {
    this.backend.start_next_activity(this.sessionRunID).subscribe(
      resp => this.router.navigate(['/desktop/session', {'sessionRunID': this.sessionRunID}]),
      err => console.log(err)
    );
  }
}

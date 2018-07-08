import {Component, OnInit, ViewEncapsulation, NgModule, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {interval} from 'rxjs/internal/observable/interval';
import {finalize, map, startWith, switchMap, take} from 'rxjs/operators';

import {BackendService} from '../../../services/backend.service';
import {WebsocketService} from '../../../services/socket.service';

import { LobbyStatus } from '../../../models/benji_models';

import {timer} from 'rxjs';

@Component({
  selector: 'app-mobile-join',
  templateUrl: './mobile-waiting-screen.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileWaitingScreenComponent implements OnInit, OnDestroy {
  sessionRunID: string;
  identity;
  whosHere: LobbyStatus;

  lobbySocket;

  constructor(private backend: BackendService, private router: Router, private route: ActivatedRoute, private ws: WebsocketService) {
    this.sessionRunID = route.snapshot.params['sessionRunID'];
    this.identity = {'first_name': ''};
    this.whosHere = {'joined_users': [], 'missing_users': [], 'started': false};
  }

  ngOnInit() {
    this.backend.get_own_identity().subscribe(
      resp => this.identity = resp,
      err => console.log(err)
    );

    this.lobbySocket = this.ws.getLobbySocket(this.sessionRunID)
      .subscribe((message: LobbyStatus) => {
        this.handleUpdate(message);
      }, (err) => console.log(err),
        () => console.log('complete'));
  }

  ngOnDestroy () {
    this.lobbySocket.unsubscribe();
  }

  handleUpdate(resp) {
    this.whosHere = resp;
    console.log(resp);
    if (this.whosHere.started) {
      this.router.navigate(['/mobile/session', {'sessionRunID': this.sessionRunID}]);
    }
  }

  startFirstActivity() {
    this.backend.start_next_activity(this.sessionRunID).subscribe(
      resp => console.log('Activity Started'),
      err => console.log(err)
    );
  }

}

import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {webSocket} from 'rxjs/webSocket';

// import * as global from '../globals';
import { LobbyStatus } from '../models/benji_models';

@Injectable()
export class WebsocketService {

  getLobbySocket(sessionrunID) {
    return webSocket('ws://localhost:8000/ws/lobby/' + sessionrunID + '/');
  }

  getSessionSocket(sessionrunID) {
    return webSocket('ws://localhost:8000/ws/session/' + sessionrunID + '/');
  }
}

import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {webSocket} from 'rxjs/webSocket';

// import * as global from '../globals';
import { LobbyStatus } from '../models/benji_models';

@Injectable()
export class WebsocketService {
  private subject;
  private sessionrunID;

  connect(sessionrunID) {
    if (this.sessionrunID === sessionrunID && this.subject) {
      return this.subject;
    } else {
      this.subject = webSocket('ws://dev.mybenji.com:8000/ws/session/' + sessionrunID + '/');
      this.sessionrunID = sessionrunID;
      return this.subject;
    }
  }

  getLobbySocket(sessionrunID) {
    // return webSocket('ws://192.168.2.200:8000/ws/lobby/' + sessionrunID + '/');
    return this.connect(sessionrunID);
  }

  getSessionSocket(sessionrunID) {
    return this.connect(sessionrunID);
  }
}

import { Injectable } from '@angular/core';
import {webSocket} from 'rxjs/webSocket';

import * as global from '../globals';

@Injectable()
export class WebsocketService {
  private subject;
  private sessionrunID;

  connect(sessionrunID) {
    if (this.sessionrunID === sessionrunID && this.subject) {
      return this.subject;
    } else {
      this.subject = webSocket(global.wsRoot + '/ws/session/' + sessionrunID + '/')
      this.sessionrunID = sessionrunID;
      return this.subject;
    }
  }

  getSessionSocket(sessionrunID) {
    return this.connect(sessionrunID);
  }
}

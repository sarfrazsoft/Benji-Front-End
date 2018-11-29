import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

import * as global from "../globals";
import { of } from "rxjs";

@Injectable()
export class WebSocketService {
  public subject: WebSocketSubject<any>;
  private sessionrunID;
  public socketData;

  connect(sessionrunID) {
    if (this.sessionrunID === sessionrunID && this.subject) {
      return this.subject;
    } else {
      this.subject = webSocket(
        global.wsRoot + "/ws/session/" + sessionrunID + "/"
      );
      this.sessionrunID = sessionrunID;
      return this.subject;
    }
  }

  getSessionSocket(sessionrunID) {
    return this.connect(sessionrunID);
  }

  public createSocketConnection(client, lessonId?, roomCode?, id?) {
    return this.getLessonSocket(client, lessonId, roomCode, id);
  }

  public setSubjectOnJoin(url) {
    this.subject = webSocket(`${global.wsRoot}${url}`);
  }

  public getLessonSocket(client, lessonId?, roomCode?, id?) {
    if (client === "screen" && !this.subject) {
      this.subject = webSocket(
        // `${global.wsRoot}/ws/activityflow/id/${lessonId}/${client}/0/`
        `${global.wsRoot}/ws/activityflow/id/1/${client}/0/`
      );
      console.log('returning screen client observable');
      return this.subject;
    } else if (client === "participant" && !this.subject) {
      this.subject = webSocket(
        `${global.wsRoot}/ws/activityflow/code/${roomCode}/${client}/${id}/`
      );
      return this.subject;
    } else if (client !== "participant" && client !== "screen") {
      this.handleSocketError(
        `You have tried to establish a WebSocket connection with an
        invalid client type. Client types available are 'screen' or
        'participant'.`
      );
    } else if (this.subject) {
      return this.subject;
    }
  }

  private handleSocketError(message: string) {
    console.error(`Web Socket Service: ${message}`);
  }

  public sendSocketEventMessage(message: string) {
    this.subject.next({'event': message});
  }

  public sendSocketFullMessage(message: any) {
    this.subject.next(message);
  }
}

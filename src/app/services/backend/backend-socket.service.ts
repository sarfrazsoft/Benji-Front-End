import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as global from '../../globals';
import { ServerMessage } from './schema/messages';

@Injectable()
export class BackendSocketService {
  public subject: WebSocketSubject<any>;
  private sessionrunID;
  public socketData;
  typingTimer;

  constructor(private httpClient: HttpClient) {}

  connectLessonSocket(clientType, lessonRun, userID?): Observable<ServerMessage> {
    let uri = null;
    if (clientType === 'screen') {
      uri = `${global.wsRoot}/ws/activityflow/code/${lessonRun.lessonrun_code}/screen/0/`;
    } else if (clientType === 'participant') {
      uri = `${global.wsRoot}/ws/activityflow/code/${lessonRun.lessonrun_code}/participant/${userID}/`;
    }
    console.log('connecting to: ' + uri);
    const webSocketSubjectConfig: WebSocketSubjectConfig<any> = {
      url: uri,
      deserializer: ({ data }) => {
        clearTimeout(this.typingTimer);
        return JSON.parse(data);
      },
      openObserver: {
        next: (val: any) => {
          this.typingTimer = setTimeout(() => {
            this.httpClient
              .get<any[]>(global.apiRoot + `/course_details/lesson/${lessonRun.id}/restart_lesson/`)
              .subscribe((v) => {
                // console.log(v);
              });
          }, 3000);
          console.log('opened');
        },
      },
    };
    const w = webSocket(webSocketSubjectConfig);
    return w;
  }

  connect(sessionrunID) {
    if (this.sessionrunID === sessionrunID && this.subject) {
      return this.subject;
    } else {
      this.subject = webSocket(global.wsRoot + '/socketService/session/' + sessionrunID + '/');
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

  public getLessonSocket(client, lessonId?, roomCode?, id?): Observable<ServerMessage> {
    if (client === 'screen' && !this.subject) {
      this.subject = webSocket(
        // `${global.wsRoot}/socketService/activityflow/id/${lessonId}/${client}/0/`
        `${global.wsRoot}/ws/activityflow/id/${lessonId}/${client}/0/`
      );
      console.log('returning screen client observable');
      return this.subject;
    } else if (client === 'participant' && !this.subject) {
      this.subject = webSocket(`${global.wsRoot}/ws/activityflow/code/${roomCode}/${client}/${id}/`);
      return this.subject;
    } else if (client !== 'participant' && client !== 'screen') {
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
    this.subject.next({ event: message });
  }

  public sendSocketFullMessage(message: any) {
    this.subject.next(message);
  }
}

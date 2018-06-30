import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as global from '../globals';

@Injectable()
export class BackendService {
  constructor(private http: HttpClient) { }

  get_runnable_sessions(courserun_num: number) {
    return this.http.get(global.apiRoot + '/mvp/active/course/' + courserun_num + '/runnable_sessions/');
  }

  start_session(courserun_num: number, session_num: number) {
    return this.http.post(global.apiRoot + '/mvp/active/course/' + courserun_num + '/start_session/', {'session': session_num});
  }

  get_sessionrun_details(sessionrunID) {
    return this.http.get(global.apiRoot + '/mvp/active/session/' + sessionrunID + '/');
  }

  get_sessionrun_attendance(sessionrunID) {
    return this.http.get(global.apiRoot + '/mvp/active/session/' + sessionrunID + '/whos_here/');
  }

  join_session(joinCode: string) {
    return this.http.post(global.apiRoot + '/mvp/active/session/code_join/', {'code': joinCode});
  }

  get_own_identity() {
    return this.http.get(global.apiRoot + '/mvp/config/users/who_am_i/');
  }

  start_next_activity(sessionrunID) {
    return this.http.post(global.apiRoot + '/mvp/active/session/' + sessionrunID + '/start_activity/', {'activity': 'next'});
  }
}

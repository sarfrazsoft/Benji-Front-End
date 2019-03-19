import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';

@Injectable()
export class LearnerService {
  constructor(
    private http: HttpClient,
    private contextService: ContextService
  ) {}

  // getAdminPanelMetrics(): Observable<any> {
  //   return this.http.get(global.apiRoot + '/rest-auth/user/').pipe(
  //     map((res: Response) => {
  //       return { learners: 106, groups: 14, sessions: 18 };
  //     }),
  //     catchError(err => of(err.error))
  //   );
  // }

  getUsers(): Observable<any> {
    return this.http.get(global.apiRoot + '/tenants/users/').pipe(
      map(res => {
        this.contextService.user = res;
        return res;
      })
    );
  }

  // getCourses(): Observable<any> {
  //   return this.http.get(global.apiRoot + '/course_details/course/').pipe(
  //     map(res => {
  //       return res;
  //     })
  //   );
  // }
}

import { Http } from '@angular/http';

const BASE_URL = 'http://node-hnapi.herokuapp.com';

@Injectable()
export class HackerNewsService {
  constructor(private http: Http) {}

  getLatestStories(page: number = 1) {
    return this.http.get(`${BASE_URL}/news?page=${page}`);
  }
}

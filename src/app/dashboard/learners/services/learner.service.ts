import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { User } from 'src/app/services/backend/schema';

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
        return res;
      })
    );
  }

  getLearners(sort: string, order: string, page: number): Observable<User> {
    // django expects page index starting from 1
    const request = global.apiRoot + '/tenants/users/?page=' + (page + 1);
    return this.http.get<User>(request);
  }

  addLearners(emails) {
    const request = global.apiRoot + '/tenants/org_invites/';
    return this.http.post(request, emails);
  }

  getUserDetails(id) {
    const request = global.apiRoot + '/tenants/users/?id=' + id;
    return this.http.get<User>(request);
  }

  // getCourses(): Observable<any> {
  //   return this.http.get(global.apiRoot + '/course_details/course/').pipe(
  //     map(res => {
  //       return res;
  //     })
  //   );
  // }
}

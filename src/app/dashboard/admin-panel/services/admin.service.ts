import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';

@Injectable()
export class AdminService {
  constructor(
    private http: HttpClient,
    private contextService: ContextService
  ) {}

  getAdminPanelMetrics(): Observable<any> {
    return this.http.get(global.apiRoot + '/rest-auth/user/').pipe(
      map((res: Response) => {
        return { learners: 106, groups: 14, sessions: 18 };
      }),
      catchError(err => of(err.error))
    );
  }

  getUser(): Observable<any> {
    return this.http.get(global.apiRoot + '/rest-auth/user/').pipe(
      map(res => {
        this.contextService.user = res;
        return res;
      })
    );
  }

  getCourses(): Observable<any> {
    return this.http.get(global.apiRoot + '/course_details/course/').pipe(
      map(res => {
        return res;
      })
    );
  }
}

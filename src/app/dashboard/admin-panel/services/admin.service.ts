import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { User } from 'src/app/services/backend/schema';
import {
  Course,
  Lesson,
  PaginatedResponse
} from 'src/app/services/backend/schema/course_details';

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

  getUser(): Observable<User> {
    return this.http.get(global.apiRoot + '/rest-auth/user/').pipe(
      map((res: User) => {
        this.contextService.user = res;
        return res;
      })
    );
  }

  getCourses(): Observable<Course[]> {
    return this.http
      .get(global.apiRoot + '/course_details/course/?page=1')
      .pipe(
        map((res: PaginatedResponse<Course>) => {
          this.contextService.courses = res.results;
          return res.results;
        })
      );
  }

  getCourseDetails(courseID: string): Observable<Course> {
    return this.http
      .get(global.apiRoot + '/course_details/course/' + courseID + '/lessons/')
      .pipe(
        map((res: Course) => {
          return res;
        })
      );
  }
}

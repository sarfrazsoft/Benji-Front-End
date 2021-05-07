import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { TeamUser, User } from 'src/app/services/backend/schema';
import { Course, Lesson, PaginatedResponse } from 'src/app/services/backend/schema/course_details';

@Injectable()
export class AdminService {
  constructor(private http: HttpClient, private contextService: ContextService) {}

  getUser(): Observable<TeamUser> {
    return this.http.get(global.apiRoot + '/tenants/users/who_am_i/').pipe(
      map((res: TeamUser) => {
        this.contextService.user = res;
        return res;
      })
    );
  }

  getLessons(): Observable<Lesson[]> {
    return this.http.get(global.apiRoot + '/course_details/lesson/').pipe(
      map((res: PaginatedResponse<Lesson>) => {
        this.contextService.lessons = res.results;
        return res.results;
      })
    );
  }

  getLessonDetails(id: number): Observable<any> {
    return this.http.get(global.apiRoot + '/course_details/lesson/' + id + '/').pipe(
      map((res) => {
        return res;
      })
    );
  }

  deleteLesson(lessonId: number): Observable<any> {
    return this.http
      .delete(global.apiRoot + `/course_details/lesson/${lessonId}/`, { observe: 'response' })
      .pipe(
        map((res) => {
          if (res.status === 204) {
            return { success: true };
          } else {
            return { success: false };
          }
        })
      );
  }
  duplicateLesson(lessonId: number): Observable<any> {
    return this.http
      .post(global.apiRoot + `/course_details/lesson/${lessonId}/duplicate/`, { observe: 'response' })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}

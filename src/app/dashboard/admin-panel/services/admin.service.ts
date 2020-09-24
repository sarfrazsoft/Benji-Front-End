import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { User } from 'src/app/services/backend/schema';
import { Course, Lesson, PaginatedResponse } from 'src/app/services/backend/schema/course_details';

@Injectable()
export class AdminService {
  constructor(private http: HttpClient, private contextService: ContextService) {}

  getUser(): Observable<User> {
    return this.http.get(global.apiRoot + '/tenants/users/who_am_i/').pipe(
      map((res: User) => {
        this.contextService.user = res;
        return res;
      })
    );
  }

  getLessons(): Observable<Course[]> {
    return this.http.get(global.apiRoot + '/course_details/lesson/').pipe(
      map((res: PaginatedResponse<Course>) => {
        this.contextService.lessons = res.results;
        return res.results;
      })
    );
  }
}

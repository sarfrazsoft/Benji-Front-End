import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from '../../globals';
import { ContextService } from '../context.service';
import { Course, LessonRun } from './schema/course_details';
import { Lesson, PaginatedResponse} from './schema/course_details';
import { User } from './schema/user';
import { PartnerInfo } from './schema/whitelabel_info';

@Injectable()
export class BackendRestService {
  constructor(private http: HttpClient, private contextService: ContextService) {}

  public userFirstName;
  public userId;
  public userIdentity: Observable<User>;
  public userEnteredroomCode;

  get_runnable_sessions(courserun_num: number) {
    return this.http.get(global.apiRoot + '/mvp/active/course/' + courserun_num + '/runnable_sessions/');
  }

  // DEMO ONLY
  createUser(username: string, enteredRoomCode: number) {
    return this.http.post(global.apiRoot + '/course_details/participant/', {
      lessonrun_code: enteredRoomCode,
      display_name: username,
    });
  }

  start_lesson(lessonID: number): Observable<LessonRun> {
    return this.http.post<LessonRun>(global.apiRoot + '/course_details/lesson/' + lessonID + '/start_lesson/', {});
  }

  get_lessonrun(roomCode: number): Observable<LessonRun> {
    return this.http.get<LessonRun>(global.apiRoot + '/course_details/lesson_run/' + roomCode + '/');
  }

  get_sessionrun_attendance(sessionrunID) {
    return this.http.get(global.apiRoot + '/mvp/active/session/' + sessionrunID + '/whos_here/');
  }

  join_session(joinCode: string) {
    return this.http.post(global.apiRoot + '/mvp/active/session/code_join/', {
      code: joinCode,
    });
  }

  get_own_identity(): Observable<User> {
    this.userIdentity = this.http.get<User>(global.apiRoot + '/tenants/users/who_am_i/');
    return this.userIdentity;
  }

  get_white_label_details(org) {
    return this.http.get(global.apiRoot + '/tenants/orgs/' + org + '/white_label_info/');
  }

  start_next_activity(sessionrunID) {
    return this.http.post(global.apiRoot + '/mvp/active/session/' + sessionrunID + '/start_activity/', {
      activity: 'next',
    });
  }

  get_all_activities(sessionrunID) {
    return this.http.get(global.apiRoot + '/mvp/active/session/' + sessionrunID + '/all_activities/');
  }

  get_activity_status(sessionrunID) {
    return this.http.get(global.apiRoot + '/mvp/active/session/' + sessionrunID + '/current_activity/');
  }

  join_activity(activityID) {
    return this.http.post(global.apiRoot + '/mvp/active/activity/' + activityID + '/join_activity/', {});
  }

  set_activity_user_parameter(activityRunID, paramName, paramValue) {
    return this.http.post(global.apiRoot + '/mvp/active/activity/' + activityRunID + '/set_parameter/', {
      param_name: paramName,
      param_value: paramValue,
    });
  }


  public validateRoomCode(roomCode) {
    return this.http.get(`${global.apiRoot}/course_details/lesson_run/${roomCode}/`);
  }

  public createCourserun() {
    return this.http.post(`${global.apiRoot}/course_details/course_run/`, {
      course: 1,
      courserunuser_set: [],
    });
  }


  get_lessons(page: number): Observable<PaginatedResponse<Lesson>> {
    const url = `${global.apiRoot}/course_details/lesson/?page=${page + 1}`;
    return this.http.get<PaginatedResponse<Lesson>>(url);
  }
}

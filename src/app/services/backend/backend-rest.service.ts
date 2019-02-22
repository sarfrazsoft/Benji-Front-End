import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as global from '../../globals';


import { User } from './schema/user';
import { Course, CourseRun, LessonRun } from './schema/course_details';
import { Observable } from 'rxjs';

@Injectable()
export class BackendRestService {
  constructor(private http: HttpClient) {}

  public userFirstName;
  public userId;
  public userIdentity: Observable<User>;

  get_runnable_sessions(courserun_num: number) {
    return this.http.get(
      global.apiRoot +
        '/mvp/active/course/' +
        courserun_num +
        '/runnable_sessions/'
    );
  }

  // DEMO ONLY
  create_courserun(courseID: number): Observable<CourseRun> {
    console.log(courseID);
    return this.http.post<CourseRun>(global.apiRoot + '/course_details/course_run/', {
      'course': courseID,
      'courserunuser_set': []
    });
  }

  // DEMO ONLY
  create_user(username: string) {
    return this.http.post(global.apiRoot + '/tenants/users/auto_create/', {
      username: username
    });
  }

  start_lesson(lessonID: number): Observable<LessonRun> {
    return this.http.get<LessonRun>(global.apiRoot + '/course_details/lesson/' + lessonID + '/start_lesson/');
  }

  get_lessonrun(roomCode: number): Observable<LessonRun> {
    return this.http.get<LessonRun>(global.apiRoot + '/course_details/lesson_run/' + roomCode + '/'
    );
  }

  get_sessionrun_attendance(sessionrunID) {
    return this.http.get(
      global.apiRoot + '/mvp/active/session/' + sessionrunID + '/whos_here/'
    );
  }

  join_session(joinCode: string) {
    return this.http.post(global.apiRoot + '/mvp/active/session/code_join/', {
      code: joinCode
    });
  }

  get_own_identity(): Observable<User> {
    this.userIdentity = this.http.get<User>(
      global.apiRoot + '/tenants/users/who_am_i/'
    );
    return this.userIdentity;
  }

  start_next_activity(sessionrunID) {
    return this.http.post(
      global.apiRoot +
        '/mvp/active/session/' +
        sessionrunID +
        '/start_activity/',
      { activity: 'next' }
    );
  }

  get_all_activities(sessionrunID) {
    return this.http.get(
      global.apiRoot +
        '/mvp/active/session/' +
        sessionrunID +
        '/all_activities/'
    );
  }

  get_activity_status(sessionrunID) {
    return this.http.get(
      global.apiRoot +
        '/mvp/active/session/' +
        sessionrunID +
        '/current_activity/'
    );
  }

  join_activity(activityID) {
    return this.http.post(
      global.apiRoot + '/mvp/active/activity/' + activityID + '/join_activity/',
      {}
    );
  }

  set_activity_user_parameter(activityRunID, paramName, paramValue) {
    return this.http.post(
      global.apiRoot +
        '/mvp/active/activity/' +
        activityRunID +
        '/set_parameter/',
      { param_name: paramName, param_value: paramValue }
    );
  }

  /**
   * Creates a new lesson instance
   * @param lessonNumber: string
   */
  public startLesson(lessonNumber, courserun) {
    return this.http.post(
      `${global.apiRoot}/course_details/course_run/${courserun}/start_lesson/ `,
      { lesson: lessonNumber }
    );
  }

  public getLessonLink(roomCode) {
    return this.http.post(
      `${global.apiRoot}/course_details/lesson/get_lessonrun_link/`,
      {
        lessonrun_code: roomCode
      }
    );
  }

  public createCourserun() {
    return this.http.post(`${global.apiRoot}/course_details/course_run/`, {
      course: 1,
      courserunuser_set: []
    });
  }
}

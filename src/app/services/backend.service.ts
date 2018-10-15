import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as global from "../globals";

import { CurrentActivityStatus } from "../models/activity";
import { User } from "../models/user";
import { Observable } from "rxjs";

@Injectable()
export class BackendService {
  constructor(private http: HttpClient) {}

  get_runnable_sessions(courserun_num: number) {
    return this.http.get(
      global.apiRoot +
        "/mvp/active/course/" +
        courserun_num +
        "/runnable_sessions/"
    );
  }

  // DEMO ONLY
  create_courserun(courseID: number) {
    return this.http.post(global.apiRoot + "/mvp/debug/courserun/", {
      course: courseID,
      courserunuser_set: []
    });
  }

  // DEMO ONLY
  create_user(username: string) {
    return this.http.post(global.apiRoot + "/mvp/debug/users/", {
      username: username,
      password: "test",
      first_name: username,
      last_name: "",
      email: ""
    });
  }

  start_session(courserun_num: number, session_num: number) {
    return this.http.post(
      global.apiRoot +
        "/mvp/active/course/" +
        courserun_num +
        "/start_session/",
      { session: session_num }
    );
  }

  start_next_session(courserun_num: number) {
    return this.http.post(
      global.apiRoot +
        "/mvp/active/course/" +
        courserun_num +
        "/start_next_session/",
      {}
    );
  }

  get_sessionrun_details(sessionrunID) {
    return this.http.get(
      global.apiRoot + "/mvp/active/session/" + sessionrunID + "/"
    );
  }

  get_sessionrun_attendance(sessionrunID) {
    return this.http.get(
      global.apiRoot + "/mvp/active/session/" + sessionrunID + "/whos_here/"
    );
  }

  join_session(joinCode: string) {
    return this.http.post(global.apiRoot + "/mvp/active/session/code_join/", {
      code: joinCode
    });
  }

  get_own_identity(): Observable<User> {
    return this.http.get<User>(global.apiRoot + "/mvp/config/users/who_am_i/");
  }

  start_next_activity(sessionrunID) {
    return this.http.post(
      global.apiRoot +
        "/mvp/active/session/" +
        sessionrunID +
        "/start_activity/",
      { activity: "next" }
    );
  }

  get_all_activities(sessionrunID) {
    return this.http.get(
      global.apiRoot +
        "/mvp/active/session/" +
        sessionrunID +
        "/all_activities/"
    );
  }

  get_activity_status(sessionrunID) {
    return this.http.get(
      global.apiRoot +
        "/mvp/active/session/" +
        sessionrunID +
        "/current_activity/"
    );
  }

  join_activity(activityID) {
    return this.http.post(
      global.apiRoot + "/mvp/active/activity/" + activityID + "/join_activity/",
      {}
    );
  }

  set_activity_user_parameter(activityRunID, paramName, paramValue) {
    return this.http.post(
      global.apiRoot +
        "/mvp/active/activity/" +
        activityRunID +
        "/set_parameter/",
      { param_name: paramName, param_value: paramValue }
    );
  }

  /**
   * Creates a new lesson instance
   * @param lessonId: string
   */
  public startLesson(lessonId, courserun) {
    return this.http.post(
      `${global.apiRoot}/course_details/course_run/${courserun}/start_lesson/ `,
      { lesson: lessonId }
    );
  }

  public createCourserun() {
    return this.http.post(`${global.apiRoot}/course_details/course_run/`, {
      course: 1,
      courserunuser_set: []
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ActivityTypes } from 'src/app/globals';
import { ContextService } from 'src/app/services';
import {
  ActivityReport,
  BrainstormReport,
  BuildAPitchReport,
  FeedbackReport,
  MCQReport,
  PitchOMaticReport,
  SessionReport,
  User,
  Users,
} from 'src/app/services/backend/schema';

@Injectable()
export class LearnerService {
  constructor(private http: HttpClient, private contextService: ContextService) {}

  getLearners(sort: string, order: string, page: number): Observable<any> {
    const request = global.apiRoot + '/tenants/team/';
    return this.http.get<any>(request);
  }

  addLearner(data) {
    const request = global.apiRoot + '/tenants/email_invite/';
    return this.http.post(request, data);
  }

  addLearners(emails) {
    const request = global.apiRoot + '/tenants/email_invite/';
    return this.http.post(request, emails);
  }

  getUserDetails(id) {
    const request = global.apiRoot + '/tenants/users/' + id + '/';
    return this.http.get<User>(request);
  }

  getOrganization() {
    const request = global.apiRoot + '/tenants/orgs/?page=' + 1;
    return this.http.get(request);
  }

  // api/course_details/lesson_run/{room_code}/summary/
  getReports(id: string): Observable<any> {
    return this.http.get(global.apiRoot + '/course_details/lesson_run/' + id + '/summary').pipe(
      map((res: SessionReport) => {
        // this.data = activityResult3;
        // res = activityResult3 as SessionReport;
        const arr: Array<ActivityReport> = [];

        arr.push(res);

        let pomActivity;

        // Iterate over each activity in order and
        // push them to the array
        res.activity_results.forEach((act, i) => {
          if (act.activity_type === ActivityTypes.mcq) {
            arr.push({
              ...res,
              mcqs: [act] as Array<MCQReport>,
              activity_type: ActivityTypes.mcq,
            });
          } else if (act.activity_type === ActivityTypes.feedback) {
            arr.push({
              ...res,
              activity_type: ActivityTypes.feedback,
              feedback: act as FeedbackReport,
            });
          } else if (act.activity_type === ActivityTypes.pitchoMatic) {
            arr.push({
              ...res,
              activity_type: ActivityTypes.pitchoMatic,
              pom: act as PitchOMaticReport,
            });
            pomActivity = {
              ...res,
              activity_type: ActivityTypes.pitchoMatic,
              pom: act as PitchOMaticReport,
            };
          } else if (act.activity_type === ActivityTypes.buildAPitch) {
            arr.push({
              ...res,
              activity_type: ActivityTypes.buildAPitch,
              bap: act as BuildAPitchReport,
            });
          } else if (act.activity_type === ActivityTypes.brainStorm) {
            arr.push({
              ...res,
              activity_type: ActivityTypes.brainStorm,
              brainstorm: act as BrainstormReport,
            });
          }
        });
        return pomActivity;
      })
    );
  }

  getPastSessions(sort: string, order: string, page: number, userID): Observable<any> {
    page = page + 1;
    return this.http
      .get(
        global.apiRoot + '/course_details/lesson_run/?page=' + page + '&host_or_participant_user=' + userID
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ActivityTypes } from 'src/app/globals';
import {
  ActivityReport,
  BuildAPitchReport,
  FeedbackReport,
  MCQReport,
  PitchOMaticReport,
  SessionReport,
  User
} from 'src/app/services/backend/schema';
import { ContextService } from 'src/app/services/context.service';
import { activityResult1 } from './activity-result-1';
import { activityResult2 } from './activity-result-2';
import { activityResult3 } from './activity-result-3';

@Injectable()
export class PastSessionsService {
  filteredInUsers: Array<number> = [];
  joinedUsers: Array<User>;
  filteredInUsers$ = new BehaviorSubject<Array<number>>([]);

  constructor(
    private http: HttpClient,
    private contextService: ContextService
  ) {}

  addToFilteredInList(id: number) {
    if (this.filteredInUsers.includes(id)) {
      const index = this.filteredInUsers.indexOf(id);
      if (index !== -1) {
        this.filteredInUsers.splice(index, 1);
        this.filteredInUsers$.next(this.filteredInUsers);
      }
    } else {
      this.filteredInUsers.unshift(id);
      this.filteredInUsers$.next(this.filteredInUsers);
    }
    if (this.filteredInUsers.length > this.joinedUsers.length) {
      this.filteredInUsers = this.filteredInUsers.slice(
        0,
        this.joinedUsers.length
      );
      this.filteredInUsers$.next(this.filteredInUsers);
    }
  }

  removeAllBut(id: number) {
    this.filteredInUsers = [id];
    this.filteredInUsers$.next(this.filteredInUsers);
  }

  selectAll() {
    this.filteredInUsers = [];
    this.joinedUsers.forEach(ju => {
      this.filteredInUsers.push(ju.id);
    });
    this.filteredInUsers$.next(this.filteredInUsers);
  }

  // api/course_details/lesson_run/{room_code}/summary/
  getReports(id: string): Observable<any> {
    return this.http
      .get(global.apiRoot + '/course_details/lesson_run/' + id + '/summary')
      .pipe(
        map((res: any) => {
          res = activityResult3;
          const arr: Array<ActivityReport> = [];

          this.joinedUsers = res.joined_users;

          if (this.filteredInUsers.length === 0) {
            res.joined_users.forEach(ju => {
              this.filteredInUsers.push(ju.id);
            });
            this.filteredInUsers$.next(this.filteredInUsers);
          }

          arr.push(res);

          // Iterate over each activity in order and
          // push them to the array
          res.activity_results.forEach((act, i) => {
            let title = '';
            for (const key in act) {
              if (act.hasOwnProperty(key)) {
                if (key !== 'base_activity') {
                  title = act['base_activity'].description;
                  act = act[key];
                  act.title = title;
                }
              }
            }
            if (act.activity_type === ActivityTypes.mcq) {
              arr.push({
                ...res,
                mcqs: [act] as Array<MCQReport>,
                activity_type: ActivityTypes.mcq,
                title: act.title
              });
            } else if (act.activity_type === ActivityTypes.feedback) {
              arr.push({
                ...res,
                activity_type: ActivityTypes.feedback,
                feedback: act as FeedbackReport,
                title: act.title
              });
            } else if (act.activity_type === ActivityTypes.pitchoMatic) {
              arr.push({
                ...res,
                activity_type: ActivityTypes.pitchoMatic,
                pom: act as PitchOMaticReport,
                title: act.title
              });
            } else if (act.activity_type === ActivityTypes.buildAPitch) {
              arr.push({
                ...res,
                activity_type: ActivityTypes.buildAPitch,
                bap: act as BuildAPitchReport,
                title: act.title
              });
            } else if (act.activity_type === ActivityTypes.brainStorm) {
              arr.push({
                ...res,
                activity_type: ActivityTypes.brainStorm,
                brainstorm: act,
                title: act.title
              });
            }
          });
          return arr;
        })
      );
  }

  getLearnerSessionSummaries(learnerId: string): Observable<any> {
    return this.http
      .get(
        // global.apiRoot +
        //   '/course_details/lesson_run/user_summary/' +
        //   learnerId +
        //   '/'
        global.apiRoot + '/tenants/users/?page=' + 1
      )
      .pipe(
        map((res: Array<SessionReport>) => {
          const pastSessionsReports: any = [
            activityResult1,
            activityResult2,
            activityResult3
          ];
          return pastSessionsReports;
          // return res;
        })
      );
  }

  getLearners(sort: string, order: string, page: number): Observable<User> {
    // django expects page index starting from 1
    const request = global.apiRoot + '/tenants/users/?page=' + (page + 1);
    return this.http.get<User>(request);
  }

  getPastSessions(sort: string, order: string, page: number): Observable<any> {
    return this.http.get(global.apiRoot + '/course_details/lesson_run/').pipe(
      map(res => {
        return res;
      })
    );
  }

  addLearners(emails: string) {
    const request = global.apiRoot + '/tenants/users/';
    return this.http.get<User>(request);
  }
}

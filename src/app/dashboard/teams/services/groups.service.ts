import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { User } from 'src/app/services/backend/schema';

@Injectable()
export class GroupsService {
  constructor(private http: HttpClient, private contextService: ContextService) {}

  getPastSessions(sort: string, order: string, page: number): Observable<any> {
    return this.http.get(global.apiRoot + '/course_details/lesson_run/').pipe(
      map((res) => {
        return res;
      })
    );
  }

  getLearners(sort: string, order: string, page: number): Observable<User> {
    // django expects page index starting from 1
    const request = global.apiRoot + '/tenants/users/?page=' + (page + 1);
    return this.http.get<User>(request);
  }

  getTeams(sort: string, order: string, page: number): Observable<any> {
    const request = global.apiRoot + '/tenants/team/';
    return this.http.get<any>(request);
  }

  addLearners(emails) {
    const request = global.apiRoot + '/tenants/org_invites/';
    return this.http.post(request, emails);
  }

  getOrganization() {
    const request = global.apiRoot + '/tenants/orgs/?page=' + 1;
    return this.http.get(request);
  }

  addGroup(organizaion: string, groupName: string) {
    const x = { organization: organizaion, group_name: groupName };
    const request = global.apiRoot + '/tenants/groups/';
    return this.http.post(request, x);
  }

  addLearnerToGroup(userId, groupId) {
    const x = { orggroup: groupId };
    const request = global.apiRoot + '/tenants/users/' + userId + '/set_group/';
    return this.http.post(request, x);
  }

  removeLearnerFromGroup(id) {
    const request = global.apiRoot + '/tenants/team_member/' + id + '/';
    return this.http.delete(request, {});
  }
}

export const group = {
  id: 1,
  name: 'Group One',
  shortName: 'group_one',
  createdOn: '2020-01-10T17:06:29.572377-05:00',
  createdBy: {
    id: 1,
    name: 'John Doe',
  },
  learners: [
    {
      id: 1,
      name: 'user one',
    },
  ],
  enrolledCourses: [
    {
      id: 1,
      name: 'Course one',
    },
    {
      id: 2,
      name: 'course two',
    },
  ],
  pastSessions: [
    {
      id: 65,
      start_time: '2020-01-10T17:06:29.572377-05:00',
      end_time: null,
      lessonrun_code: 14439,
      learners: 4,
      host: {
        id: 6,
        username: 'www',
        first_name: 'mww',
        other: 'propertyName',
      },
    },
  ],
};

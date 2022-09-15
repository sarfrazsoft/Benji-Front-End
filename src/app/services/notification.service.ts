import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { TeamUser, User } from 'src/app/services/backend/schema';
import { Notification, NotificationResult } from './backend/schema/notification';

@Injectable()
export class NotificationService {
  constructor(private http: HttpClient, private contextService: ContextService) {}

  saveUser(user): Observable<TeamUser> {
    return this.http.patch(global.apiRoot + '/tenants/users/' + user.id + '/', user).pipe(
      map((res: TeamUser) => {
        this.contextService.user = res;
        return res;
      })
    );
  }

  getNotifications(unread: boolean): Observable<Array<Notification>> {
    let filterParams = '';
    if (unread) {
      filterParams = '?&unread=True';
    }
    return this.http.get(global.apiRoot + '/notifications/' + filterParams).pipe(
      map((res: NotificationResult) => {
        return res.results;
      })
    );
  }

  markAsRead(notificationId: number) {
    return this.http.patch(global.apiRoot + `/notifications/read/${notificationId}/`, {}).pipe(
      map((res: Notification) => {
        return res;
      })
    );
  }

  markAllasRead() {
    return this.http.post(global.apiRoot + `/notifications/mark-all/`, {}).pipe(
      map((res: Notification) => {
        return res;
      })
    );
  }

  // TODO implement types
  resetPassword(oldPassword, newPassword1, newPassword2): Observable<any> {
    const passwords = {
      old_password: oldPassword,
      new_password1: newPassword1,
      new_password2: newPassword2,
    };
    return this.http.post(global.apiRoot + '/rest-auth/password/change/', passwords);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { User } from 'src/app/services/backend/schema';

@Injectable()
export class AccountService {
  constructor(
    private http: HttpClient,
    private contextService: ContextService
  ) {}

  saveUser(user): Observable<any> {
    return this.http
      .patch(global.apiRoot + '/tenants/users/' + user.id + '/', user)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  resetPassword(oldPassword, newPassword1, newPassword2): Observable<any> {
    const passwords = {
      old_password: oldPassword,
      new_password1: newPassword1,
      new_password2: newPassword2
    };
    return this.http.post(
      global.apiRoot + '/rest-auth/password/change/',
      passwords
    );
  }
}

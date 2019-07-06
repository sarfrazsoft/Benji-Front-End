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
      .put(global.apiRoot + '/tenants/users/' + user.id + '/', user)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}

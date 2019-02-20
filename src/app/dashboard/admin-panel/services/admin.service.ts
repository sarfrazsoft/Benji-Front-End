import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';

@Injectable()
export class AdminService {
  constructor(
    private http: HttpClient,
    private contextService: ContextService
  ) {}

  getAdminPanelMetrics(args): Observable<any> {
    return this.http
      .post(global.apiRoot + '/rest-auth/user/', {
        username: 'bleh'
      })
      .pipe(
        map((res: Response) => res),
        catchError(err => of(err.error))
      );
  }

  getUser(): Observable<any> {
    const email = localStorage.getItem('email');
    return this.http.get(global.apiRoot + '/rest-auth/user/').pipe(
      map(res => {
        this.contextService.selected = res;
        return res;
      })
    );
  }
}

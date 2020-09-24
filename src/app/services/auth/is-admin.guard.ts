import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map } from 'rxjs/operators';
import { AdminService } from 'src/app/dashboard';
import * as global from 'src/app/globals';
import { User } from '../backend/schema';
import { ContextService } from '../context.service';

@Injectable({
  providedIn: 'root',
})
export class IsAdminGuard implements CanActivate {
  constructor(
    private contextService: ContextService,
    private router: Router,
    private httpClient: HttpClient
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const user: User = this.contextService.user;
    if (this.contextService.user) {
      if (user) {
        if (user.local_admin_permission) {
          return true;
        }
      }
    } else {
      return this.getUser().map((u) => u.local_admin_permission);
    }
  }

  canLoad(route: Route) {
    if (this.contextService.user && this.contextService.user.local_admin_permission) {
      return true;
    }
    return false;
  }

  getUser(): Observable<User> {
    return this.httpClient.get(global.apiRoot + '/tenants/users/who_am_i/').pipe(
      map((res: User) => {
        this.contextService.user = res;
        return res;
      })
    );
  }
}

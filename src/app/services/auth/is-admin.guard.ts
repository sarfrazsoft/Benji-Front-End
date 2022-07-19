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
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AdminService } from 'src/app/dashboard';
import * as global from 'src/app/globals';
import { TeamUser, User } from '../backend/schema';
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
      return this.getUser().map((u) => true);
    }
  }

  canLoad(route: Route) {
    if (this.contextService.user && this.contextService.user.local_admin_permission) {
      return true;
    }
    return false;
  }

  getUser(): Observable<TeamUser> {
    return this.httpClient.get(global.apiRoot + '/tenants/users/who_am_i/').pipe(
      map((res: TeamUser) => {
        this.contextService.user = res;
        if(res.branding) {
          this.contextService.brandingInfo = res.branding;
        }
        return res;
      })
    );
  }
}

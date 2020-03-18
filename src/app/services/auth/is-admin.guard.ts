import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map } from 'rxjs/operators';
import { User } from '../backend/schema';
import { ContextService } from '../context.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {
  constructor(private contextService: ContextService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.contextService.user$.pipe(
      map((user: User) => {
        if (user.local_admin_permission) {
          return true;
        }
        this.router.navigate(['/dashboard']);
        return false;
      })
    );
  }

  canLoad(route: Route) {
    if (
      this.contextService.user &&
      this.contextService.user.local_admin_permission
    ) {
      return true;
    }
    return false;
  }
}

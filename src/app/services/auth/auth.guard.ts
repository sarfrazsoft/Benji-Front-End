import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ContextService } from '../context.service';
import { LayoutService } from '../layout.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService,
    private layoutService: LayoutService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (next.queryParams.emailReport === 'showReport') {
      this.layoutService.hideSidebar = true;
      const res = JSON.parse(
        '{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTkyNDYzNjE4LCJqdGkiOiIxYTc3MjEzM2EyOGU0Mjc1YmIwYzAzNThiMzI3ZTc1NCIsInVzZXJfaWQiOjZ9.X2kzHtb5Da4ZLRI2AcJ8PiPiLkXp_emKWl6qssbuI6Y","user":{"id":6,"organization":{"id":1,"org_name":"Benji","shortname":null,"course_permissions":[]},"orggroup":{"id":1,"organization":1,"group_name":"Sales","member_count":3},"last_login":"2020-03-21T22:49:39-04:00","is_superuser":false,"username":"mahinatgmaildotcom","first_name":"random","last_name":"user","email":"mahin@gmail.com","is_staff":false,"is_active":true,"date_joined":"2020-03-21T22:49:39-04:00","job_title":"Dev","local_admin_permission":true,"participant_permission":true,"groups":[],"user_permissions":[],"user_course_permissions":[1,3,7,8,10,12,11,9,13,14,16,17,18]}}'
      );
      localStorage.setItem('token', res.token);
      this.contextService.user = res.user;

      return true;
    } else if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  canLoad(route: Route): boolean | Observable<boolean> {
    if (this.authService.isLoggedIn()) {
      // TODO navigate based on user role?
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
// http://localhost:4200/dashboard/pastsessions/60481
// http://localhost:4200/dashboard/pastsessions/60481?emailReport=showReport

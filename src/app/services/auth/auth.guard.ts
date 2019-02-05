import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  canLoad(route: Route): boolean | Observable<boolean> {
    if (route.path) {
      // what role was the user attempting to view
      const account = route.path.split('/')[0];

      // If user is admin he load the admin-panel
      if (this.authService.getUserRole() === 'admin') {
        // TODO navigate based on user role?
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      return true;
    }
  }
}

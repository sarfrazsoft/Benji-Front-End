import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import {
  AuthService,
  BackendRestService,
  ContextService,
} from 'src/app/services';
import { AdminService } from './admin.service';

@Injectable()
export class AdminResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService,
    private backendRestService: BackendRestService,
    private contextService: ContextService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    try {
      let user;
      if (!this.contextService.user) {
        user = await this.adminService.getUser().toPromise();
      } else {
        user = this.contextService.user;
      }

      const courses = await this.adminService.getCourses().toPromise();

      return { user: user, courses: courses };
    } catch (err) {
      console.log(err);
    }
  }
}

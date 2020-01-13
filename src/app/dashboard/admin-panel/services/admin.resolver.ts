import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { AuthService, BackendRestService } from 'src/app/services';
import { AdminService } from './admin.service';

@Injectable()
export class AdminResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService,
    private backendRestService: BackendRestService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    try {
      const user = await this.adminService.getUser().toPromise();

      const courses = await this.adminService.getCourses().toPromise();

      const whiteLabelInfo = await this.backendRestService
        .get_white_label_details(user.organization)
        .toPromise();

      console.log(whiteLabelInfo);

      return { user: user, courses: courses, whiteLabelInfo: whiteLabelInfo };
    } catch (err) {
      console.log(err);
    }
  }
}

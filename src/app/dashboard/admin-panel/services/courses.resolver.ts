import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { AuthService } from 'src/app/services';
import { AdminService } from './admin.service';

@Injectable()
export class CoursesResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    try {
      const courses = await this.adminService.getCourses().toPromise();
      console.log(courses);
      return courses;
    } catch (err) {
      console.log(err);
    }
  }
}

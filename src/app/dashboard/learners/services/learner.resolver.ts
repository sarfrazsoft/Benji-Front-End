import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { AuthService } from 'src/app/services';
import { LearnerService } from './learner.service';

@Injectable()
export class LearnerResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private authService: AuthService,
    private learnerService: LearnerService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    try {
      // const metricsData = await this.adminService.getAdminPanelMetrics(id);
      // return metricsData;

      const users = await this.learnerService.getUsers().toPromise();

      // const courses = await this.adminService.getCourses().toPromise();
      return { user: users };
    } catch (err) {
      console.log(err);
    }
  }
}

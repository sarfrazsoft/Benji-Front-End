import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { AuthService } from 'src/app/services';
import { GroupsService } from './groups.service';

@Injectable()
export class GroupsResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private authService: AuthService,
    private learnerService: GroupsService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    try {
      // const metricsData = await this.adminService.getAdminPanelMetrics(id);
      // return metricsData;

      const users = await this.learnerService.getUsers().toPromise();

      // const courses = await this.adminService.getCourses().toPromise();
      return { users: users };
    } catch (err) {
      console.log(err);
    }
  }
}

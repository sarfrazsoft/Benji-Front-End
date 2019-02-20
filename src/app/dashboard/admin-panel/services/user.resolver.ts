import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { AuthService } from 'src/app/services';
import { AdminService } from './admin.service';

@Injectable()
export class UserResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    try {
      // const metricsData = await this.adminService.getAdminPanelMetrics(id);
      // return metricsData;

      const user = await this.adminService.getUser().toPromise();
      return user;
    } catch (err) {
      console.log(err);
    }
  }
}

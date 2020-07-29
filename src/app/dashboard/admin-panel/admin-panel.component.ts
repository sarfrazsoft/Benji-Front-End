import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ContextService } from 'src/app/services';
import {
  JobInfoDialogComponent,
  JoinSessionDialogComponent,
  LaunchSessionDialogComponent,
} from '../../shared';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'benji-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
  courses: Array<any> = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private contextService: ContextService,
    private dialog: MatDialog
  ) {
    this.activatedRoute.data.forEach((data: any) => {
      this.courses = data.dashData.courses;
      // if (!data.dashData.user.job_title) {
      //   this.dialog
      //     .open(JobInfoDialogComponent, {
      //       data: {
      //         name: data.dashData.user.first_name
      //       },
      //       disableClose: true,
      //       panelClass: 'dashboard-dialog'
      //     })
      //     .afterClosed()
      //     .subscribe(res => {
      //       console.log(res);
      //     });
      // }
    });
  }

  ngOnInit() {}
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ContextService } from 'src/app/services';
import {
  JobInfoDialogComponent,
  JoinSessionDialogComponent,
  LaunchSessionDialogComponent
} from '../../shared';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'benji-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  courses: Array<any> = [];
  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private contextService: ContextService,
    private dialog: MatDialog
  ) {
    this.route.data.forEach((data: any) => {
      console.log(data);
      this.courses = [
        {
          id: 1,
          name: 'Active Listening 1',
          description:
            'Active Listening is a session that teaches participants the value'
        },
        {
          id: 2,
          name: 'Active Listening 2',
          description:
            'Active Listening is a session that teaches participants the value 2'
        }
      ];
      // if (!data.userData.job_title) {
      //   this.dialog
      //     .open(JobInfoDialogComponent, {
      //       data: {
      //         name: data.userData.first_name
      //       },
      //       disableClose: true
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

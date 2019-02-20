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
  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private contextService: ContextService,
    private dialog: MatDialog
  ) {
    this.route.data.forEach((data: any) => {
      console.log(data);
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

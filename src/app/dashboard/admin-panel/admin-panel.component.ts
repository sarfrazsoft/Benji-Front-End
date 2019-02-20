import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContextService } from 'src/app/services';
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
    private contextService: ContextService
  ) {}

  ngOnInit() {
    this.route.data.forEach((data: any) => {
      console.log(data.userData);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService, ContextService } from 'src/app/services';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'benji-topbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  user: any = {};

  hideSidebar = false;
  constructor(
    private authService: AuthService,
    private contextService: ContextService,
    private layoutService: LayoutService
  ) {
    layoutService.hideSidebar$.subscribe((v) => {
      this.hideSidebar = v;
    });
  }

  ngOnInit() {
    this.contextService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  logout(): void {
    this.authService.signOut();
  }
}

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
  logo = '';
  isEmailedReport = false;
  constructor(
    private authService: AuthService,
    private contextService: ContextService,
    private layoutService: LayoutService
  ) {
    layoutService.isEmailedReport$.subscribe((v) => {
      this.isEmailedReport = v;
    });
  }

  ngOnInit() {
    this.contextService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });

    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.logo = info.parameters.darkLogo;
      }
    });
  }

  logout(): void {
    this.authService.signOut();
  }
}

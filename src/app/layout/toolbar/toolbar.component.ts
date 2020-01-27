import { Component, OnInit } from '@angular/core';
import { AuthService, ContextService } from 'src/app/services';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

@Component({
  selector: 'benji-topbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  user: any = {};
  logo = '';
  constructor(
    private authService: AuthService,
    private contextService: ContextService
  ) {}

  ngOnInit() {
    this.contextService.user$.subscribe(user => {
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

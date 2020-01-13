import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ContextService } from 'src/app/services';

@Component({
  selector: 'benji-mobile-entry',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit {
  isDemoSite = true;
  showLoginMob = true;
  logo;
  constructor(
    private router: Router,
    private authService: AuthService,
    private contextService: ContextService
  ) {
    // demo.mybenji.com
    if (window.location.href.split('.')[0].includes('demo')) {
      this.isDemoSite = true;
    }
  }

  ngOnInit() {
    if (this.authService.userInvitation) {
      this.showLoginMob = false;
    }

    this.contextService.partnerInfo$.subscribe(info => {
      if (info) {
        this.logo = info.parameters.darkLogo;
      }
    });
  }
}

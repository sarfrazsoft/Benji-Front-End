import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'benji-mobile-entry',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit {
  isDemoSite = true;
  showLoginMob = true;
  constructor(private router: Router, private authService: AuthService) {
    // demo.mybenji.com
    if (window.location.href.split('.')[0].includes('demo')) {
      this.isDemoSite = true;
    }
  }

  ngOnInit() {
    if (this.authService.userInvitation) {
      this.showLoginMob = false;
    }
  }
}

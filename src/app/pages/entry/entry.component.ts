import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'benji-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {
  selectedTab = 0;
  isMobile = false;
  showLoginMob = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private deviceService: DeviceDetectorService
  ) {
    // this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  showSignupTab(): void {
    this.selectedTab = 1;
  }
}

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      // this.router.navigate(['/dashboard']);
    }
    this.isMobile = this.deviceService.isMobile();
  }

  showSignupTab(): void {
    this.selectedTab = 1;
  }
}

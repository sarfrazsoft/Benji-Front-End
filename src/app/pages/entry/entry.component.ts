import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService, ContextService } from 'src/app/services';

@Component({
  selector: 'benji-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {
  selectedTab = 0;
  isMobile = false;
  welcomeText: string;
  link: string;
  logo;

  constructor(
    private authService: AuthService,
    private contextService: ContextService,
    private router: Router,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      // this.router.navigate(['/dashboard']);
    }
    this.isMobile = this.deviceService.isMobile();

    this.contextService.partnerInfo$.subscribe(info => {
      if (info) {
        this.welcomeText = info.welcome_text;
        this.link = info.link;
        this.logo = info.darkLogo;
      }
    });
  }

  showSignupTab(): void {
    this.selectedTab = 1;
  }
}

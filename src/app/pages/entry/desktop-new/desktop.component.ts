import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService, ContextService } from 'src/app/services';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

@Component({
  selector: 'benji-desktop-entry-new',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss'],
})
export class DesktopComponent implements OnInit {
  selectedTab = 0;
  welcomeText: string;
  link: string;
  description: string;
  name: string;
  logo;
  constructor(
    private authService: AuthService,
    private contextService: ContextService,
    private router: Router,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.welcomeText = info.welcome_text;
        this.name = info.name;
        this.link = info.link;
        this.logo = info.parameters.darkLogo;
        this.description = info.parameters.welcomeDescription;
      }
    });
  }

  showSignupTab(): void {
    this.selectedTab = 1;
  }
}

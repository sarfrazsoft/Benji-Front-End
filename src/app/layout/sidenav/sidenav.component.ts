import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService, ContextService } from 'src/app/services';
import { Branding, User } from 'src/app/services/backend/schema';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { JoinSessionDialogComponent, LaunchSessionDialogComponent } from '../../shared';
import { SidenavItem } from './sidenav-item/sidenav-item.component';

export interface SidenavSection {
  section: number;
  items: Array<SidenavItem>;
}

@Component({
  selector: 'benji-menu',
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent implements OnInit {
  sidenavTopSections: Array<SidenavSection> = [];
  sidenavBottomSections: Array<SidenavSection> = [];
  courses;
  launchArrow = '';
  logo = '';

  dashboard = {
    section: 1,
    items: [
      {
        navName: 'Home',
        navRoute: './',
        permission: '',
        icon: '/assets/img/dashboard/home.svg',
      },
    ],
  };

  notifications = {
    section: 2,
    items: [
      {
        navName: 'Notifications',
        navRoute: 'notifications',
        icon: '/assets/img/dashboard/notifications.svg',
      },
    ],
  };

  templatesSection = {
    section: 3,
    items: [
      {
        navName: 'Templates',
        navRoute: './templates',
        icon: '/assets/img/dashboard/templates.svg',
      },
    ],
  };

  helpCenter = {
    section: 9,
    items: [
      {
        navName: 'Help Center',
        navRoute: 'https://guides.mybenji.com/',
        icon: '/assets/img/dashboard/help.svg',
      },
    ],
  };

  accountSection = {
    section: 5,
    items: [
      {
        navName: 'Settings',
        navRoute: 'account',
        icon: '/assets/img/dashboard/settings.svg',
      },
    ],
  };

  authSection = {
    section: 7,
    items: [
      {
        navName: 'Logout',
        navRoute: 'logout',
        icon: '/assets/img/dashboard/log-out.svg',
      },
    ],
  };

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private authService: AuthService,
    private contextService: ContextService
  ) {}

  ngOnInit() {
    this.initNavigation();
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.launchArrow = info.parameters.joinArrow;
      }
    });

    this.contextService.brandingInfo$.subscribe((info: Branding) => {
      if (info) {
        this.logo = info.logo ? info.logo.toString() : '/assets/img/Benji_logo.svg';
      }
    });
  }

  launchSession(): void {
    this.dialog
      .open(LaunchSessionDialogComponent, {
        panelClass: 'dashboard-dialog',
      })
      .afterClosed()
      .subscribe((user) => {});
  }

  joinSession(): void {
    this.dialog
      .open(JoinSessionDialogComponent, {
        panelClass: 'dashboard-dialog',
      })
      .afterClosed()
      .subscribe((user) => {});
  }

  logout() {
    this.authService.signOut();
  }

  initNavigation() {
    this.contextService.user$.subscribe((user) => {
      this.sidenavTopSections = [
        this.dashboard,
        //this.templatesSection,
        //this.notifications,
      ];
      this.sidenavBottomSections = [
        this.accountSection,
        this.helpCenter,
        this.authSection,
      ];
    });
  }
}

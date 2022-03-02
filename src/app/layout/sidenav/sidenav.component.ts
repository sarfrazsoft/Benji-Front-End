import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService, ContextService } from 'src/app/services';
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
  sidenavSections: Array<SidenavSection> = [];
  courses;
  launchArrow = '';
  logo = '';

  dashboard = {
    section: 1,
    items: [
      {
        navName: 'Sessions',
        navRoute: './',
        permission: '',
        icon: '/assets/img/navigation/user.svg',
      },
    ],
  };

  templatesSection = {
    section: 3,
    items: [
      {
        navName: 'Templates',
        navRoute: './templates',
        icon: '/assets/img/navigation/bulb.svg',
      },
    ],
  };

  helpCenter = {
    section: 9,
    items: [
      {
        navName: 'Help Center',
        navRoute: 'https://guides.mybenji.com/',
        icon: '/assets/img/navigation/help.svg',
      },
    ],
  };

  accountSection = {
    section: 5,
    items: [
      {
        navName: 'Account',
        navRoute: 'account',
        icon: '/assets/img/navigation/account.svg',
      },
    ],
  };

  authSection = {
    section: 7,
    items: [
      {
        navName: 'Logout',
        navRoute: 'logout',
        icon: '/assets/img/navigation/logOut.svg',
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

    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.logo = info.parameters.darkLogo;
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
      this.sidenavSections = [
        this.dashboard,
        // this.templatesSection,
        // this.helpCenter,
        this.accountSection,
        this.authSection,
      ];
    });
  }
}

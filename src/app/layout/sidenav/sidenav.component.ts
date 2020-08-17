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

  adminSection = {
    section: 1,
    items: [
      {
        navName: 'Learners',
        navRoute: './learners',
        permission: 'admin',
      },
      // {
      //   navName: 'Groups',
      //   navRoute: './groups'
      // },
      // {
      //   navName: 'Past Sessions',
      //   navRoute: './pastsessions'
      // }
    ],
  };

  groupsSection = {
    section: 2,
    items: [
      {
        navName: 'Groups',
        navRoute: './groups',
        permission: 'admin',
      },
      // {
      //   navName: 'Groups',
      //   navRoute: './groups'
      // },
      // {
      //   navName: 'Past Sessions',
      //   navRoute: './pastsessions'
      // }
    ],
  };

  pastSessionSection = {
    section: 3,
    items: [
      // {
      //   navName: 'Learners',
      //   navRoute: './learners',
      //   permission: 'admin'
      // }
      // {
      //   navName: 'Groups',
      //   navRoute: './groups'
      // },
      {
        navName: 'Past Sessions',
        navRoute: './pastsessions',
      },
    ],
  };

  accountSection = {
    section: 4,
    items: [
      {
        navName: 'Account',
        navRoute: 'account',
      },
      // {
      //   navName: 'Settings',
      //   navRoute: 'settings'
      // },
      // {
      //   navName: 'Help',
      //   navRoute: 'help'
      // }
    ],
  };

  profile = {
    section: 5,
    items: [
      {
        navName: 'Profile',
        navRoute: '',
      },
    ],
  };

  authSection = {
    section: 5,
    items: [
      {
        navName: 'Logout',
        navRoute: 'logout',
      },
    ],
  };

  editor = {
    section: 6,
    items: [
      {
        navName: 'Editor',
        navRoute: 'editor',
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
      if (user.local_admin_permission) {
        this.sidenavSections = [
          this.adminSection,
          // this.groupsSection,
          this.pastSessionSection,
          this.accountSection,
          this.authSection,
          this.editor,
        ];
      } else {
        this.profile.items[0].navRoute = 'learners/' + user.id;
        this.sidenavSections = [this.profile, this.accountSection, this.authSection];
      }
    });
  }
}

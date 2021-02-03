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
        navName: 'My Sessions',
        navRoute: './',
        permission: '',
        icon: '../../../../assets/img/mySessions.svg',
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

  adminSection = {
    section: 1,
    items: [
      {
        navName: 'Teams',
        navRoute: './learners',
        permission: 'admin',
        disabled: true,
        icon: null,
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
        navName: 'Participants',
        navRoute: './participants',
        icon: '../../../../assets/img/participantIcon.svg',
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
        navName: 'Reports',
        navRoute: './pastsessions',
        icon: '../../../../assets/img/reportsIcon.svg',
      },
    ],
  };

  accountSection = {
    section: 4,
    items: [
      {
        navName: 'Account',
        navRoute: 'account',
        icon: '../../../../assets/img/accountIcon.svg',
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
        icon: '../../../../assets/img/logoutIcon.svg',
      },
    ],
  };

  editor = {
    section: 6,
    items: [
      {
        navName: 'Editor',
        navRoute: 'editor',
        icon: '../../../../assets/img/editorIcon.png',
      },
    ],
  };

  helpCenter = {
    section: 6,
    items: [
      {
        navName: 'Help Center',
        navRoute: 'http://help.mybenji.com/en/',
        icon: '../../../../assets/img/helpCenter.svg',
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
        this.helpCenter,
        // this.adminSection,
        this.groupsSection,
        // this.editor,
        this.pastSessionSection,
        this.accountSection,
        this.authSection,
        //
      ];
      /*if (user.local_admin_permission) {

      } else {
        this.profile.items[0].navRoute = 'learners/' + user.id;
        this.sidenavSections = [this.profile, this.accountSection, this.authSection];
      }*/
    });
  }
}

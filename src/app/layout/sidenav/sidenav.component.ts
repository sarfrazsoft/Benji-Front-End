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
        icon: '/assets/img/navigation/mySessions.svg',
        hoverIcon: '/assets/img/navigation/mySessionsHover.svg',
        activeIcon: '/assets/img/navigation/mySessionsActive.svg',
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
    ],
  };

  templatesSection = {
    section: 3,
    items: [
      {
        navName: 'Templates',
        navRoute: './templates',
        icon: '/assets/img/navigation/bulb.svg',
        hoverIcon: '/assets/img/navigation/bulbHover.svg',
        activeIcon: '/assets/img/navigation/bulbActive.svg',
      },
    ],
  };

  pastSessionSection = {
    section: 4,
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
        icon: '/assets/img/navigation/reports.svg',
        hoverIcon: '/assets/img/navigation/reportsHover.svg',
        activeIcon: '/assets/img/navigation/reportsActive.svg',
      },
    ],
  };

  accountSection = {
    section: 5,
    items: [
      {
        navName: 'Profile',
        navRoute: 'account',
        icon: '/assets/img/navigation/user.svg',
        hoverIcon: '/assets/img/navigation/userHover.svg',
        activeIcon: '/assets/img/navigation/userActive.svg',
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
    section: 6,
    items: [
      {
        navName: 'Profile',
        navRoute: '',
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
        hoverIcon: '/assets/img/navigation/logOutHover.svg',
      },
    ],
  };

  editor = {
    section: 8,
    items: [
      {
        navName: 'Editor',
        navRoute: 'editor',
        icon: '../../../../assets/img/editorIcon.png',
      },
    ],
  };

  helpCenter = {
    section: 9,
    items: [
      {
        navName: 'Help Center',
        navRoute: 'http://help.mybenji.com/en/',
        icon: '/assets/img/navigation/help.svg',
        hoverIcon: '/assets/img/navigation/helpHover.svg',
        activeIcon: '/assets/img/navigation/helpActive.svg',
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
        // this.adminSection,
        // this.groupsSection,
        // this.editor,
        this.pastSessionSection,
        this.accountSection,
        this.templatesSection,
        this.helpCenter,
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

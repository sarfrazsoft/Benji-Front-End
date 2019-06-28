import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
  JoinSessionDialogComponent,
  LaunchSessionDialogComponent
} from '../../shared';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services';
import { SidenavItem } from './sidenav-item/sidenav-item.component';

export interface SidenavSection {
  section: number;
  items: Array<SidenavItem>;
}

@Component({
  selector: 'benji-menu',
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent implements OnInit {
  sidenavSections: Array<SidenavSection> = [];
  courses;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initNavigation();
  }

  launchSession(): void {
    this.dialog
      .open(LaunchSessionDialogComponent, {
        panelClass: 'dashboard-dialog'
      })
      .afterClosed()
      .subscribe(user => {});
  }

  joinSession(): void {
    this.dialog
      .open(JoinSessionDialogComponent, {
        panelClass: 'dashboard-dialog'
      })
      .afterClosed()
      .subscribe(user => {});
  }

  logout() {
    this.authService.signOut();
  }

  initNavigation() {
    this.sidenavSections = [
      {
        section: 1,
        items: [
          {
            navName: 'Learners',
            navRoute: './learners'
          }
          // {
          //   navName: 'Groups',
          //   navRoute: './groups'
          // },
          // {
          //   navName: 'Past Sessions',
          //   navRoute: './pastsessions'
          // }
        ]
      },
      // {
      //   section: 2,
      //   items: [
      //     {
      //       navName: 'Account',
      //       navRoute: 'accounts'
      //     },
      //     {
      //       navName: 'Settings',
      //       navRoute: 'settings'
      //     },
      //     {
      //       navName: 'Help',
      //       navRoute: 'help'
      //     }
      //   ]
      // },
      {
        section: 3,
        items: [
          {
            navName: 'Logout',
            navRoute: 'logout'
          }
        ]
      }
    ];
  }
}

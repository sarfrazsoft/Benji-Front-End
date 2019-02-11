import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
  JoinSessionDialogComponent,
  LaunchSessionDialogComponent
} from '../../shared';

import { SidenavItem } from './sidenav-item/sidenav-item.component';

export interface SidenavSection {
  section: number;
  items: SidenavItem;
}

@Component({
  selector: 'benji-menu',
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent implements OnInit {
  sidenavSections: any[] = [];
  route: string;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.initNavigation();
  }

  launchSession(): void {
    this.dialog
      .open(LaunchSessionDialogComponent, {})
      .afterClosed()
      .subscribe(user => {});
  }

  joinSession(): void {
    this.dialog
      .open(JoinSessionDialogComponent, {})
      .afterClosed()
      .subscribe(user => {});
  }

  initNavigation() {
    this.sidenavSections = [
      {
        section: 1,
        items: [
          {
            navName: 'Learners',
            navRoute: 'dashboard/learners'
          },
          {
            navName: 'Groups',
            route: 'groups'
          },
          {
            navName: 'Past Sessions',
            route: 'pastsessions'
          }
        ]
      },
      {
        section: 2,
        items: [
          {
            navName: 'Account',
            route: 'accounts'
          },
          {
            navName: 'Settings',
            route: 'settings'
          },
          {
            navName: 'Help',
            route: 'help'
          }
        ]
      },
      {
        section: 3,
        items: [
          {
            navName: 'Logout',
            route: 'logout'
          }
        ]
      }
    ];
  }
}
